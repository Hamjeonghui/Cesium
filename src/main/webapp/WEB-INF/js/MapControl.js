import { TILE_LAYER_URL, DEFAULT_CAMERA_POS } from './Constans.js';

export let viewer = null;

/**
 * Cesium Viewer를 초기화하고 기본 지도 레이어 및 카메라 위치를 설정합니다.
 *
 * @function initCesiumViewer
 * @param {string} [containerId='cesiumContainer'] - 뷰어를 렌더링할 HTML 요소의 ID
 * @returns {Cesium.Viewer} 초기화된 Cesium Viewer 인스턴스
 *
 * @description
 * - 기본 terrain과 imagery를 제거하고, OpenStreetMap 레이어를 수동으로 추가합니다.
 * - 카메라는 지정된 위치(예: 제주공항)로 이동합니다.
 * - 초기 지도 구성 시 단 한 번 호출되어야 합니다.
 *
 * @example
 * const viewer = initCesiumViewer('cesiumContainer');
 */
export function initCesiumViewer(containerId = 'cesiumContainer') {
    viewer = new Cesium.Viewer(containerId, {
        baseLayerPicker: false,
        sceneMode: Cesium.SceneMode.SCENE2D,
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        imageryProvider: false,
        geocoder: false //지역 검색버튼 제거
    });

    const osmLayer = new Cesium.UrlTemplateImageryProvider({
        url: TILE_LAYER_URL,
        credit: '© OpenStreetMap contributors'
    });

    viewer.imageryLayers.addImageryProvider(osmLayer);
    flyToDefaultCameraPosition();

    return viewer;
}

/**
 * 카메라를 기본 위치로 이동시킵니다.
 *
 * @function flyToDefaultCameraPosition
 *
 * @description
 * - Cesium `viewer`가 정의되어 있을 경우, `DEFAULT_CAMERA_POS` 위치로 카메라를 이동시킵니다.
 * - 이동 시간은 필요시 `duration` 옵션을 통해 조정 가능합니다.(제거 시, 기본값으로 설정됨)
 *
 */
export function flyToDefaultCameraPosition() {
    if (!viewer) return;

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(...DEFAULT_CAMERA_POS),
        duration: 1.5
    });
}