import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

export default function BeautyLight() {
  const [backgroundColor, setBackgroundColor] = useState("#FFF8F0");
  const [brightness, setBrightness] = useState(100);
  const [warmth, setWarmth] = useState(50);
  const [isCustomBg, setIsCustomBg] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);

  // 更少女的预设色彩
  const presets = [
    { name: "牛奶白", bg: "#FFF8F0", brightness: 100, warmth: 55 },
    { name: "蜜桃粉", bg: "#FFD1DF", brightness: 90, warmth: 70 },
    { name: "樱花粉", bg: "#FFE4F0", brightness: 95, warmth: 60 },
    { name: "薰衣草紫", bg: "#E6E6FA", brightness: 85, warmth: 50 },
    { name: "薄荷绿", bg: "#D0F5E8", brightness: 90, warmth: 40 },
    { name: "天空蓝", bg: "#E0F7FA", brightness: 95, warmth: 30 },
    { name: "奶咖棕", bg: "#EEDFCC", brightness: 85, warmth: 80 },
    { name: "蜜橘橙", bg: "#FFE5B4", brightness: 90, warmth: 75 },
  ];

  useEffect(() => {
    if (!isCustomBg) {
      const warmthFactor = warmth / 100;
      const r = Math.min(255, Math.round(255 * (0.7 + 0.3 * warmthFactor)));
      const g = Math.min(255, Math.round(255 * (0.7 + 0.3 * warmthFactor)));
      const b = Math.min(255, Math.round(255 * (1 - 0.5 * warmthFactor)));
      const brightnessFactor = brightness / 100;
      const rFinal = Math.round(r * brightnessFactor);
      const gFinal = Math.round(g * brightnessFactor);
      const bFinal = Math.round(b * brightnessFactor);
      setBackgroundColor(`rgb(${rFinal}, ${gFinal}, ${bFinal})`);
    }
  }, [brightness, warmth, isCustomBg]);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          setCameraError(true);
          console.error("无法访问摄像头", err);
        });
    }
  }, []);

  // 滑块变动时退出自定义色，取消高亮
  const handleBrightness = (val) => {
    setBrightness(val);
    setIsCustomBg(false);
    setActivePreset(null);
  };
  const handleWarmth = (val) => {
    setWarmth(val);
    setIsCustomBg(false);
    setActivePreset(null);
  };

  return (
    <>
      <div className="beauty-light-bg" style={{ backgroundColor }} />
      <div className="center-container column-center">
        {/* 相框在最上方 */}
        <div className="frame w-full max-w-sm aspect-[3/4] mb-8 girl-frame">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none bg-white/80">
              <p className="text-center px-4">
                无法访问摄像头，请检查权限设置<br />
                屏幕光线会为您提供自然补光效果
              </p>
            </div>
          )}
          {!cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
              <p className="text-center px-4">
                请将脸部置于此框内<br />
                屏幕光线会为您提供自然补光效果
              </p>
            </div>
          )}
        </div>
        {/* 预设色彩+调节区合并为一个panel */}
        <div className="panel w-full max-w-md girl-panel">
          <div className="girl-section-title">💖 预设少女色彩</div>
          <div className="girl-preset-btn-group">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                className={`girl-preset-btn2${activePreset === idx ? ' active' : ''}`}
                style={{ background: preset.bg, color: activePreset === idx ? '#fff' : '#a16ae8' }}
                onClick={() => {
                  setBackgroundColor(preset.bg);
                  setBrightness(preset.brightness);
                  setWarmth(preset.warmth);
                  setIsCustomBg(true);
                  setActivePreset(idx);
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
          <div className="girl-slider-label">亮度调节 <span className="slider-value">{brightness}</span></div>
          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={brightness}
            onChange={e => handleBrightness(Number(e.target.value))}
            className="girl-slider-long"
          />
          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>暗</span>
            <span>亮</span>
          </div>
          <div className="girl-slider-label">色温调节 <span className="slider-value">{warmth}</span></div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={warmth}
            onChange={e => handleWarmth(Number(e.target.value))}
            className="girl-slider-long"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>冷光</span>
            <span>暖光</span>
          </div>
        </div>
        <footer className="mt-8 text-xs opacity-70 girl-footer">
          <p>美丽从光开始，调整属于你的专属少女色彩吧！</p>
        </footer>
      </div>
    </>
  );
} 