import React, { useState, useRef, useEffect } from 'react';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import './index.less';

// 基础使用
const Page1 = () => {
	const [isPlaying, setIsPlaying] = useState(false);

	const audioCtx = useRef<AudioContext>();
	const gain = useRef<GainNode>();
	const panner = useRef<StereoPannerNode>();

	const [gainValue, setGainValue] = useState(1);
	const [pannerValue, setPannerValue] = useState(1);

	useEffect(() => {
		return () => {
			audioCtx.current?.close();
		}
	}, [])

	const init = () => {
		audioCtx.current = new AudioContext();

		const audio = audioCtx.current;
		fetch('http://yu-img.curtaintan.club/MELANCHOLY.mp3')
		.then(res => res.arrayBuffer())
		.then(buffer => {
			return audio.decodeAudioData(buffer);
		}).then((decodedBuffer: any) => {
			const sourceNode = new AudioBufferSourceNode(audio, {
				buffer: decodedBuffer,
				loop: true,
			})
			gain.current = new GainNode(audio);
			panner.current = new StereoPannerNode(audio,  { pan: 0  });
			sourceNode.connect(gain.current).connect(panner.current).connect(audio.destination);

			sourceNode.start(0);
			setIsPlaying(true);
		})
	}

	const start = () => {
		if (!audioCtx.current) {
			init();
		} else {
			if (!isPlaying) {
				setIsPlaying(true);
				audioCtx.current.resume();
			}
		}
	}

	const stop = () => {
		if (isPlaying) {
			audioCtx.current?.suspend();
			setIsPlaying(false);
		}
	}

	const volumeChange = (value: any) => { 
		setGainValue(value);
		if (gain.current) {
			gain.current.gain.value = value;
		}
	}

	const pannerChange = (value: any) => {
		setPannerValue(value);
		if (panner.current) {
			panner.current.pan.value = value;
		}
	}

	return (
		<div className='page2'>
			<div className='title'>音频播放器基础版</div>
			<div className='input'>
				音量：
				<div style={{ width: 300 }}>
					<Slider
						min={0}
						max={2}
						step={0.01}
						value={gainValue}
						onChange={volumeChange}
					/>
				</div>
			</div>
			<div className='input'>
				左右声道：
				<div style={{ width: 300 }}>
					<Slider
						min={0}
						max={2}
						step={0.01}
						value={pannerValue}
						onChange={pannerChange}
					/>
				</div>
			</div>
			<div className='btn-group'>
				<div className={`btn ${isPlaying ? 'disable' : ''}`} onClick={start}>开始</div>
				<div className={`btn ${isPlaying ? '' : 'disable'}`} onClick={stop}>暂停</div>
			</div>
		</div>
	);
}

export default Page1
