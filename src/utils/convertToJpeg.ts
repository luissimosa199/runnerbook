export function convertToJpeg(pngFile: any) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
  
        canvas.width = img.width;
        canvas.height = img.height;

        if(!context){
            throw "canvas.getContext(2d) is false"
        }
  
        // Draw the image on the canvas
        context.drawImage(img, 0, 0);
  
        // Convert the canvas content to JPEG
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = function () {
                if (reader.result) {
                  resolve(reader.result);
                } else {
                  reject(new Error("Failed to convert image to JPEG"));
                }
              };
              reader.onerror = function () {
                reject(new Error("Failed to convert image to JPEG"));
              };
              reader.readAsDataURL(blob);
            } else {
              reject(new Error("Failed to convert image to JPEG"));
            }
          },
          "image/jpeg",
          0.9 // JPEG quality (0.0 - 1.0)
        );
      };
  
      img.onerror = function () {
        reject(new Error("Failed to load image"));
      };
  
      img.src = URL.createObjectURL(pngFile);
    });
  }