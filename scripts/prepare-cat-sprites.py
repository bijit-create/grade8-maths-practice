"""Package a generated 6 x 4 raster atlas; preserve its artwork and alpha channel."""
from pathlib import Path
from collections import deque
import json
import shutil
import sys
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'artwork/cat-atlas.png'
image = Image.open(source).convert('RGBA')
width, height = image.size
assert width % 6 == 0 and height % 4 == 0, 'Atlas must contain a regular 6 x 4 grid'
assert width // 6 == height // 4, 'Sprite cells must be square'
assert image.getchannel('A').getextrema()[0] == 0, 'Atlas must have real transparency'
cell = width // 6
original = root / 'artwork/cat-atlas.png'
original.parent.mkdir(exist_ok=True)
if source.resolve() != original.resolve():
    shutil.copyfile(source, original)

out = root / 'study-materials/assets/cats'
out.mkdir(parents=True, exist_ok=True)
# Extract complete connected silhouettes before packing. Generated jump frames can
# cross a nominal cell boundary; simple grid cropping would cut off their ears.
mask = image.getchannel('A').point(lambda a: 255 if a > 16 else 0).tobytes()
seen = bytearray(width * height)
components = {}
for seed, visible in enumerate(mask):
    if not visible or seen[seed]:
        continue
    queue = deque([seed])
    seen[seed] = 1
    left = right = seed % width
    top = bottom = seed // width
    count = 0
    while queue:
        pixel = queue.popleft()
        x, y = pixel % width, pixel // width
        left, right, top, bottom = min(left, x), max(right, x), min(top, y), max(bottom, y)
        count += 1
        neighbours = []
        if x: neighbours.append(pixel - 1)
        if x < width - 1: neighbours.append(pixel + 1)
        if y: neighbours.append(pixel - width)
        if y < height - 1: neighbours.append(pixel + width)
        for neighbour in neighbours:
            if mask[neighbour] and not seen[neighbour]:
                seen[neighbour] = 1
                queue.append(neighbour)
    if count < 100:
        continue
    key = ((top + bottom) // (2 * cell), (left + right) // (2 * cell))
    if key not in components or count > components[key][0]:
        components[key] = (count, (left, top, right + 1, bottom + 1))
assert len(components) == 24, 'Expected one complete cat per cell'
packed = Image.new('RGBA', image.size)
states = [('walk', 120), ('sit', 500), ('knock', 180), ('celebrate', 130)]
manifest = {'columns': 6, 'rows': 4, 'cellSize': cell, 'frames': {}}
for row, (state, duration) in enumerate(states):
    frames = []
    frame_bounds = []
    baseline = max(components[(row, column)][1][3] - row * cell for column in range(6))
    for column in range(6):
        box = components[(row, column)][1]
        scale = .78
        cat = image.crop(box).resize((round((box[2]-box[0])*scale), round((box[3]-box[1])*scale)), Image.Resampling.LANCZOS)
        frame = Image.new('RGBA', (cell, cell))
        x = (cell - cat.width) // 2
        y = round(cell * .86 - (baseline - (box[1] - row*cell)) * scale)
        frame.paste(cat, (x, y))
        bounds = frame.getchannel('A').point(lambda a: 255 if a > 16 else 0).getbbox()
        assert bounds and bounds[0] > 0 and bounds[1] > 0 and bounds[2] < cell and bounds[3] < cell, f'Clipped frame: {state}/{column}'
        frame_bounds.append(bounds)
        name = f'{state}-{column+1:02}.webp'
        frame.save(out / name, lossless=True, method=6)
        frames.append(frame)
        packed.paste(frame, (column*cell, row*cell))
    manifest['frames'][state] = {'row': row, 'count': 6, 'durationMs': duration, 'bounds': frame_bounds}
    frames[0].save(out / f'{state}-animated.webp', save_all=True, append_images=frames[1:], duration=duration, loop=0, lossless=True, method=6)
packed.save(out / 'cat-sprites.webp', lossless=True, method=6)
(out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
shutil.copytree(out, root / 'site/assets/cats', dirs_exist_ok=True)
print(f'Packaged 24 transparent {cell}x{cell} frames, four animated previews and a shared atlas.')
