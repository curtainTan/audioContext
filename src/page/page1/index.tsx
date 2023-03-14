import React, { useState, useRef, useEffect } from 'react';

import './index.less';

const Page1 = () => {
	const [statusText, setStatusText]= useState('');
	const [isPlaying, setIsPlaying] = useState(false);

	const canvasElRef = useRef<HTMLCanvasElement>(null);
	const canvasCtxRef = useRef<CanvasRenderingContext2D | null>();

	const sourceNodeRef = useRef<AudioBufferSourceNode>();
	const audioCtx = useRef<AudioContext>();

	useEffect(() => {
		if (canvasElRef.current) {
			canvasCtxRef.current = canvasElRef.current.getContext('2d');
		}
	}, []);

	const init = () => {
		const audio = new AudioContext();
		audioCtx.current = audio;
		setStatusText('加载中...');

		fetch('http://yu-img.curtaintan.club/MELANCHOLY.mp3')
		.then(res => res.arrayBuffer())
		.then(buffer => {
			return audio.decodeAudioData(buffer);
		}).then((decodedBuffer: any) => {
			setStatusText('audio 开始配置....');

			const sourceNode = new AudioBufferSourceNode(audio, {
				buffer: decodedBuffer,
				loop: true,
			})

			sourceNodeRef.current = sourceNode;

			const analyserNode = new AnalyserNode(audio);
			const jsNode = audio.createScriptProcessor(1024, 1, 1);

			sourceNode.connect(audio.destination);
			sourceNode.connect(analyserNode)
			analyserNode.connect(jsNode);
			jsNode.connect(audio.destination);

			setStatusText('播放中...')
			sourceNode.start(0);

			jsNode.onaudioprocess = () => {
				const amplitudeArray = new Uint8Array(
					analyserNode.frequencyBinCount,
				)

				analyserNode.getByteTimeDomainData(amplitudeArray)

				if (audio.state === 'running') {
					requestAnimationFrame(() => {
						const ctx = canvasCtxRef.current;
						if (ctx) {
							const canvasH = canvasElRef.current?.height || 0;
							const canvasW = canvasElRef.current?.width || 0;

							ctx.clearRect(0, 0 , canvasW, canvasH);

							for(let i = 0; i < amplitudeArray.length; i ++) {
								const v = amplitudeArray[i] / 256;
								const y = canvasH - canvasH * v;
								ctx.fillStyle = 'white';
								ctx.fillRect(i, y, 1, 1);
							}
						}
					})
				}
			}
		})
	}

	const start = () => {
		if (!isPlaying) {
			setIsPlaying(true);
			if (!audioCtx.current) {
				init()
			} else {
				audioCtx.current.resume();
				setStatusText('播放中....');
			}
		}
	}

	const stop = () => {
		if (isPlaying) {
			setIsPlaying(false);
			audioCtx.current?.suspend();
			setStatusText('暂停中...');
		}
	}

	return (
		<div className='page1'>
			<div className='title'>音频播放器</div>
			<canvas className='canvas' ref={canvasElRef} width="512" height="256"></canvas>
			<div className='btn-group'>
				<div className={`btn ${isPlaying ? 'disable' : ''}`} onClick={start}>开始</div>
				<div className={`btn ${isPlaying ? '' : 'disable'}`} onClick={stop}>暂停</div>
			</div>
			<div>{statusText}</div>
		</div>
	);
}

export default Page1
