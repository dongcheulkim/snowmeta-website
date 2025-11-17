from PIL import Image
import os

# 최적화할 이미지 목록 (images 폴더의 모든 jpg 파일)
import glob
images = glob.glob('images/*.jpg')

for img_path in images:
    if os.path.exists(img_path):
        print(f"Optimizing {img_path}...")

        # 이미지 열기
        img = Image.open(img_path)

        # 크기 조정 (최대 1200px)
        max_size = 1200
        if img.width > max_size or img.height > max_size:
            if img.width > img.height:
                new_width = max_size
                new_height = int(img.height * (max_size / img.width))
            else:
                new_height = max_size
                new_width = int(img.width * (max_size / img.height))
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # RGB로 변환 (JPEG는 RGBA를 지원하지 않음)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        # 품질을 85%로 저장 (원본 덮어쓰기)
        img.save(img_path, 'JPEG', quality=85, optimize=True)

        # 파일 크기 확인
        size = os.path.getsize(img_path) / 1024 / 1024
        print(f"  -> Saved: {size:.2f} MB")

print("All images optimized!")
