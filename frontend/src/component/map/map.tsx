import { useEffect, useRef } from 'react';
import './map.css';

const Map = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const loadScript = () => {
            const existingScript = document.getElementById('longdo-map-script');
            if (existingScript) return initMap();

            const script = document.createElement('script');
            script.src = 'https://api.longdo.com/map3/?key=f278aaef2d456a4e85e80715f7f32ef9'; // เปลี่ยน YOUR-API-KEY ด้วยของคุณ
            script.id = 'longdo-map-script';
            script.onload = initMap;
            document.body.appendChild(script);

        };
        const initMap = () => {
            if ((window as any).longdo && mapRef.current) {
                const mapInstance = new (window as any).longdo.Map({
                    placeholder: mapRef.current,
                    language: 'th',
                    lastView: false,
                    zoom: 15,
                });

                setTimeout(() => {
                    mapInstance.Ui.DPad.visible(false);
                    mapInstance.Ui.Terrain.visible(false);
                    mapInstance.Ui.Scale.visible(false);
                }, 100);
            }
        };
        loadScript();
    }, []);

    return (
        <div className="map-container">
            <div className="map-content">
                <div id="map" ref={mapRef}></div>
            </div>
        </div>
    );
};

export default Map;
