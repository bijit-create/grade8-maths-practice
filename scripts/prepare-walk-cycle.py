"""Register and package twelve generated walk drawings without redrawing them."""
from pathlib import Path
from collections import deque
from statistics import median
import json
import shutil
import sys
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'artwork/cat-walk-v2.png'
image = Image.open(source).convert('RGBA')
width, height = image.size
assert width % 4 == 0 and height % 3 == 0 and width//4 == height//3
source_cell = width // 4
original = root / 'artwork/cat-walk-v2.png'
if source.resolve() != original.resolve():
    shutil.copyfile(source, original)
mask = image.getchannel('A').point(lambda a: 255 if a > 16 else 0).tobytes()
seen = bytearray(width * height)
components = {}
for seed, visible in enumerate(mask):
    if not visible or seen[seed]: continue
    queue = deque([seed]); seen[seed] = 1
    left = right = seed % width; top = bottom = seed // width; count = 0
    while queue:
        pixel = queue.popleft(); x, y = pixel % width, pixel // width
        left, right, top, bottom = min(left,x), max(right,x), min(top,y), max(bottom,y)
        count += 1
        for neighbour in ([pixel-1] if x else []) + ([pixel+1] if x<width-1 else []) + ([pixel-width] if y else []) + ([pixel+width] if y<height-1 else []):
            if mask[neighbour] and not seen[neighbour]: seen[neighbour]=1; queue.append(neighbour)
    if count < 100: continue
    key=((top+bottom)//(2*source_cell),(left+right)//(2*source_cell))
    if key not in components or count>components[key][0]: components[key]=(count,(left,top,right+1,bottom+1))
assert len(components)==12, 'Expected twelve complete walk silhouettes'
scale=176/max(box[2]-box[0] for _,box in components.values())
atlas=Image.new('RGBA',(1024,768)); frames=[]; bounds=[]; anchors=[]
out=root/'study-materials/assets/cats'
for row in range(3):
    for column in range(4):
        box=components[(row,column)][1]
        # Register on the amber eye, rather than the changing leg/tail silhouette.
        eyes=[]
        for y in range(box[1],round(box[1]+(box[3]-box[1])*.6)):
            for x in range(round(box[0]+(box[2]-box[0])*.6),box[2]):
                r,g,b,a=image.getpixel((x,y))
                if a>200 and r>140 and 80<g<r*.88 and b<g*.65: eyes.append((x,y))
        assert eyes, f'Missing eye registration in {row}/{column}'
        eye=(median(x for x,y in eyes),median(y for x,y in eyes))
        cat=image.crop(box).resize((round((box[2]-box[0])*scale),round((box[3]-box[1])*scale)),Image.Resampling.LANCZOS)
        x=round(196-(eye[0]-box[0])*scale); y=round(125-(eye[1]-box[1])*scale)
        frame=Image.new('RGBA',(256,256)); frame.paste(cat,(x,y))
        extent=frame.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox()
        assert extent and min(extent[:2])>0 and max(extent[2:])<256, f'Clipped walk frame {row}/{column}'
        frame.save(out/f'walk-v2-{len(frames)+1:02}.webp',lossless=True,method=6)
        atlas.paste(frame,(column*256,row*256)); frames.append(frame); bounds.append(extent)
        anchors.append([round(x+(eye[0]-box[0])*scale,2),round(y+(eye[1]-box[1])*scale,2)])
atlas.save(out/'walk-sprites-v2.webp',lossless=True,method=6)
frames[0].save(out/'walk-v2-animated.webp',save_all=True,append_images=frames[1:],duration=80,loop=0,lossless=True,method=6)
shutil.copyfile(out/'walk-v2-animated.webp',out/'walk-animated.webp')
manifest=json.loads((out/'manifest.json').read_text())
manifest['frames']['walk']={'atlas':'walk-sprites-v2.webp','columns':4,'rows':3,'count':12,'durationMs':80,'bounds':bounds,'eyeAnchors':anchors}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
shutil.copytree(out,root/'site/assets/cats',dirs_exist_ok=True)
print('Packaged twelve registered walking frames, a dedicated atlas and an animated preview.')
