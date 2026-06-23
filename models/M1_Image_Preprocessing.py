import cv2
import numpy as np
import albumentations as A


class TrafficPreprocessor:

    def __init__(self):

        self.transform = A.Compose([
            A.Resize(640, 640),
            A.Normalize()
        ])

    def gamma_correction(self, img, gamma=3.0):

        inv_gamma = 1.0 / gamma

        table = np.array(
            [((i / 255.0) ** inv_gamma) * 255
             for i in np.arange(256)]
        ).astype("uint8")

        return cv2.LUT(img, table)

    def apply_clahe(self, img):

        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)

        l, a, b = cv2.split(lab)

        clahe = cv2.createCLAHE(
            clipLimit=4.0,
            tileGridSize=(8, 8)
        )

        l = clahe.apply(l)

        merged = cv2.merge((l, a, b))

        enhanced = cv2.cvtColor(
            merged,
            cv2.COLOR_LAB2BGR
        )

        return enhanced

    def apply_denoising(self, img):

        denoised = cv2.fastNlMeansDenoisingColored(
            img,
            None,
            10,
            10,
            7,
            21
        )

        return denoised

    def process(self, image_path):

        img = cv2.imread(image_path)

        if img is None:
            raise Exception(
                f"Could not load image: {image_path}"
            )

        cv2.imwrite(
            "before.jpg",
            img
        )

        # Step 1: Brighten dark images
        img = self.gamma_correction(
            img,
            gamma=1.0
        )

        # Step 2: Improve local contrast
        img = self.apply_clahe(img)

        # Step 3: Remove noise
        img = self.apply_denoising(img)

        cv2.imwrite(
            "after.jpg",
            img
        )

        transformed = self.transform(
            image=img
        )

        tensor = transformed["image"]

        return tensor


if __name__ == "__main__":

    # IMAGE_PATH = "idd-lite\\idd20k_lite\\gtFine\\train\\0\\024541_label.png"
    IMAGE_PATH = "idd-lite\\idd20k_lite\\leftImg8bit\\test\\8\\004475_image.jpg"

    preprocessor = TrafficPreprocessor()

    tensor = preprocessor.process(
        IMAGE_PATH
    )

    print("\n===== MODULE 1 COMPLETE =====")
    print("Tensor Shape :", tensor.shape)
    print("Tensor Type  :", tensor.dtype)
    print("Tensor Min   :", np.min(tensor))
    print("Tensor Max   :", np.max(tensor))
    print("=============================\n")

    print("Saved:")
    print("before.jpg")
    print("after.jpg")
        
    
