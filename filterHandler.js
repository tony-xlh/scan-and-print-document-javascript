const filterCanvas = document.createElement('canvas');

const canvasToBlob = async () => {
  return new Promise((resolve, reject) => {
    filterCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }else{
        reject();
      }
    },"image/jpeg",100);
  })
}

const imageFromBlob = async (blob) => {
  return new Promise((resolve, _reject) => {
    let img = document.createElement("img");
    img.onload = function () {
      resolve(img);
    }
    let url = URL.createObjectURL(blob);
    img.src = url;
  })
}

class ImageFilter extends Dynamsoft.DDV.ImageFilter {
  async applyFilter(image, type) {
    if (type === "removeShadow") {
      let img = await imageFromBlob(image.data);
      let blackwhiteFilter = new BlackwhiteFilter(filterCanvas,127,true,true,31,10);
      blackwhiteFilter.process(img);
      let blob = await canvasToBlob();
      return new Promise((r, _j) => {
        r(blob)
      });
    }else{
      return super.applyFilter(image, type);
    }
  };
  get defaultFilterType() {
    return "none"
  };
  querySupported() {
    return [
      {type: "none", label: "Original"},
      {type: "blackAndWhite", label: "B&W"},
      {type: "gray", label: "Grayscale"},
      {type: "saveInk", label: "SaveToner"},
      {type: "removeShadow", label: "RemoveShadow"},
    ]
  };
  destroy() {
    super.destroy()
  };
}

function setImageFilterHandler(){
  const imageFilter = new ImageFilter();
  Dynamsoft.DDV.setProcessingHandler("imageFilter", imageFilter);
}

