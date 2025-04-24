function signatureCapture() {
    const canvas = document.getElementById("newSignature");
    const context = canvas.getContext("2d");
    canvas.width = 276;
    canvas.height = 180;
    context.fillStyle = "#fff";
    context.strokeStyle = "#444";
    context.lineWidth = 1.5;
    context.lineCap = "round";
    context.fillRect(0, 0, canvas.width, canvas.height);
    let disableSave = true;
    const pixels = [];
    const cpixels = [];
    let xyLast = {};
    let xyAddLast = {};
    let calculate = false;
    {   //functions
      function remove_event_listeners() {
        canvas.removeEventListener('mousemove', on_mousemove, false);
        canvas.removeEventListener('mouseup', on_mouseup, false);
        canvas.removeEventListener('touchmove', on_mousemove, false);
        canvas.removeEventListener('touchend', on_mouseup, false);
  
        document.body.removeEventListener('mouseup', on_mouseup, false);
        document.body.removeEventListener('touchend', on_mouseup, false);
      }
  
      function get_coords(e) {
        let x, y;
  
        if (e.changedTouches && e.changedTouches[0]) {
          const offsety = canvas.offsetTop || 0;
          const offsetx = canvas.offsetLeft || 0;
  
          x = e.changedTouches[0].pageX - offsetx;
          y = e.changedTouches[0].pageY - offsety;
        } else if (e.layerX || 0 == e.layerX) {
          x = e.layerX;
          y = e.layerY;
        } else if (e.offsetX || 0 == e.offsetX) {
          x = e.offsetX;
          y = e.offsetY;
        }
  
        return {
          x : x, y : y
        };
      }
  
      function on_mousedown(e) {
        e.preventDefault();
        e.stopPropagation();
  
        canvas.addEventListener('mouseup', on_mouseup, false);
        canvas.addEventListener('mousemove', on_mousemove, false);
        canvas.addEventListener('touchend', on_mouseup, false);
        canvas.addEventListener('touchmove', on_mousemove, false);
        document.body.addEventListener('mouseup', on_mouseup, false);
        document.body.addEventListener('touchend', on_mouseup, false);
  
        empty = false;
        const xy = get_coords(e);
        context.beginPath();
        pixels.push('moveStart');
        context.moveTo(xy.x, xy.y);
        pixels.push(xy.x, xy.y);
        xyLast = xy;
      }
  
      function on_mousemove(e, finish) {
        e.preventDefault();
        e.stopPropagation();
  
        const xy = get_coords(e);
        const xyAdd = {
          x: (xyLast.x + xy.x) / 2,
          y: (xyLast.y + xy.y) / 2
        };
  
        if (calculate) {
          const xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
          const yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
          pixels.push(xLast, yLast);
        } else {
          calculate = true;
        }
  
        context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
        pixels.push(xyAdd.x, xyAdd.y);
        context.stroke();
        context.beginPath();
        context.moveTo(xyAdd.x, xyAdd.y);
        xyAddLast = xyAdd;
        xyLast = xy;
  
      }
  
      function on_mouseup(e) {
        remove_event_listeners();
        disableSave = false;
        context.stroke();
        pixels.push('e');
        calculate = false;
      }
    }
    canvas.addEventListener('touchstart', on_mousedown, false);
    canvas.addEventListener('mousedown', on_mousedown, false);
  }
  
  function signatureSave() {
    const canvas = document.getElementById("newSignature"); // save canvas image as data url (png format by default)
    if(isCanvasFilled(canvas)){
      const dataURL = canvas.toDataURL("image/png");
      let signaturePreview = document.getElementById("signaturePreview");
      signaturePreview.src = dataURL;
      signaturePreview.style.display = "block";
      document.getElementById('signatureInput').value = dataURL;
    }
  }
  
  function isCanvasFilled(canvas) {
    const context = canvas.getContext('2d');
    const canvasData = context.getImageData(0, 0, canvas.width, canvas.height).data;
  
    // Loop through all the pixels to check if they are all white
    for (let i = 0; i < canvasData.length; i += 4) {
      const r = canvasData[i];     // Red
      const g = canvasData[i + 1]; // Green
      const b = canvasData[i + 2]; // Blue
      const a = canvasData[i + 3]; // Alpha
  
      // Check if any pixel is not white (255, 255, 255, 255)
      if (r !== 255 || g !== 255 || b !== 255 || a !== 255) {
        return true; // The canvas is not empty
      }
    }
    return false; // The canvas is empty
  }
  
  function signatureClear() {
    const canvas = document.getElementById("newSignature");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function submitSignature() {
    const formData = new FormData(document.getElementById('signatureForm'));

    fetch('submit_signature.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert('Signature submitted successfully!');
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}