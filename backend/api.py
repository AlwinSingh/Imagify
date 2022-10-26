import cv2
from flask import Flask, request, make_response, send_file, jsonify
from cartoonify import run_cartoonify
from backgroundify import run_removeBg
import matplotlib.pyplot as plt
import numpy as np
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)

@app.route("/cartoonify", methods=['POST'])
def get_recommendation():
    uploaded_image = request.files['image']
    filename = request.files['image'].filename + '-cartoonified'

    image_data = cv2.imdecode(np.frombuffer(uploaded_image.read(), np.uint8), cv2.IMREAD_UNCHANGED)
    cartoon_img = run_cartoonify(image_data)

    retval, buffer = cv2.imencode('.png', cartoon_img)
    response = make_response(buffer.tobytes())
    response.headers.set('Content-Type', 'image/png')
    response.headers.set(
        'Content-Disposition', 'attachment', filename='%s.png' % filename)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/removebg", methods=['POST'])
def removebg_api():
    uploaded_image = request.files['image']
    filename = request.files['image'].filename + '-removebg'

    image_data = cv2.imdecode(np.frombuffer(uploaded_image.read(), np.uint8), cv2.IMREAD_UNCHANGED)
    image_data = cv2.cvtColor(image_data, cv2.COLOR_BGR2RGB)
    removebg_img = run_removeBg(image_data)

    buffered = BytesIO()
    removebg_img.save(buffered, format="PNG")
    buffered.seek(0)
    #img_str = base64.b64encode(buffered.getvalue())
    #im = Image.open(BytesIO(base64.b64decode(img_str)))
    #bytes = base64.encodebytes(data)

    response = make_response(send_file(
        buffered,
        as_attachment=True,
        download_name='image.png',
        mimetype='image/png'
    ))
    response.headers.set('Content-Type', 'image/png')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)