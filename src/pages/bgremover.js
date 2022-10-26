import React, { useState } from 'react'
import { FileUploader } from "react-drag-drop-files";
import ReactCompareImage from 'react-compare-image';
import Lottie from 'react-lottie';
import * as loadingAnimation from './loading.json'
import './common.css';

const fileTypes = ["JPG", "JPEG", "PNG"];
const cartoonify_api = 'http://localhost:5000/removebg'

const lottieOptions = {
	loop: true,
	autoplay: true, 
	animationData: loadingAnimation,
	rendererSettings: {
	  preserveAspectRatio: 'xMidYMid slice'
	}
};

const BackgroundRemover = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [bgRemoveFile, setBgRemoveFile] = useState(null);
	
  	const handleChange = (file) => {
		setBgRemoveFile(null); //Reset cartoon file
    	setFile(file);
  	}

	function sendCartoonifyRequest() {
		setIsLoading(true);
		const formData = new FormData();
    	formData.append('image', file);

		const requestOptions = {
			method: 'POST',
			body: formData
		  };
	  
		  fetch(cartoonify_api, requestOptions)
		  .then(response => response.blob())
		  .then(imageBlob => {
			const cartoonImageObjectURL = URL.createObjectURL(imageBlob);
      		console.log(cartoonImageObjectURL);
			setBgRemoveFile(cartoonImageObjectURL)
		  })
		  .catch(err => {
			setBgRemoveFile(null)
			console.log(err)
		  }).finally(() => {
			setIsLoading(false)
		  });
	}

	function renderDragDropUi() {
		return (
		<div className='drag-drop-container'>
			<p className='drag-drop-text p-3'>
				<strong>Choose a file</strong> or drag it here
			</p>
			<p className='text-center font-weight-bold'>
				{file != null ? <strong>File {file.name} received, press 'Remove Background'!</strong>
				: 'Awaiting your upload...'}</p>
		</div>
		)
	}

	return (
		<div className='container mt-5'>
			<h6>Image Background Remover</h6>
			<div className='row'>
				<FileUploader 
							children={renderDragDropUi()}
							name="file" 
							types={fileTypes}
							hoverTitle="Drop here"
							handleChange={handleChange} 
							onTypeError={(err) => { window.alert('File type not supported') }}
							onSizeError={(err) => { window.alert('File size is too big') }} />
				{file != null && !isLoading ?
				<button className='btn btn-md drag-drop-btn mt-3 rounded-0 w-100' onClick={() => sendCartoonifyRequest()} disabled={file == null || bgRemoveFile != null}>
					{bgRemoveFile != null ? 'Background Removed!' : 'Remove Background!'}
				</button>
				: null}
			</div>

			{isLoading ? 
			<Lottie options={lottieOptions}
			height={400}
			width={400} />
			:
			<div className="compare-container mt-2">
				{file != null & bgRemoveFile != null ?
				<div className='row text-center mx-auto d-block'>
					<ReactCompareImage leftImage={file != null ? URL.createObjectURL(file) : null}
									   rightImage={bgRemoveFile} />
					<a className="btn btn-sm download-btn col-12 p-3 mt-3 mb-2" href={URL.createObjectURL(file)} download={'original-image-' + file.name}>Download Original Image</a>
					<a className="btn btn-sm download-btn col-12 p-3 mb-5" href={bgRemoveFile} download={'bgremove-image-' + file.name}>Download New Image</a>
				</div>
				: null}
			</div>
			}
		</div>
	);
};

export default BackgroundRemover;