/**
 * 클릭된 엔터티의 정보를 기반으로 툴팁을 화면에 표시합니다.
 *
 * @function showTooltip
 * @param {Cesium.Entity} entity - 클릭된 Cesium 엔터티 객체
 * @param {Cesium.Cartesian2} screenPosition - 클릭된 화면상의 좌표 (픽셀 단위)
 * @param {Cesium.Viewer} viewer - Cesium 뷰어 인스턴스
 *
 * @description
 * - 풍향, 풍속, 고도 등의 정보를 툴팁 영역(#tooltip)에 렌더링합니다.
 * - 툴팁은 클릭된 위치 근처에 띄워집니다.
 */
function showTooltip(entity, screenPosition, viewer) {
    const cartesian = viewer.scene.pickPosition(screenPosition);
    if (!cartesian) return;

    const windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);

    $('#tooltip-content').html(`
        <br>
        <b>${entity.name || '정보 없음'}</b>
        <p>풍향: ${entity.properties.wdir || '-'}°</p>
        <p>풍속: ${entity.properties.wspd || '-'}kt</p>
        <p>고도: ${entity.properties.altitude || '-'}ft</p>
    `);

    $('#tooltip').css({
        left: windowPosition.x + 20,
        top: windowPosition.y - 20,
        display: 'block'
    });
}

/**
 * 현재 화면에 표시된 툴팁을 숨깁니다.
 *
 * @function hideTooltip
 */
export function hideTooltip() {
    $('#tooltip').hide();
}

/**
 * Cesium 화면에서 엔터티 클릭 시 툴팁이 표시되도록 이벤트를 등록합니다.
 *
 * @function initCesiumTooltipEvent
 * @param {Cesium.Viewer} viewer - Cesium 뷰어 인스턴스
 *
 * @description
 * - LEFT_CLICK 이벤트에 반응하여 툴팁을 표시하거나 숨깁니다.
 * - wdir, wspd, altitude 속성이 모두 존재하는 엔터티만 툴팁 대상입니다.
 * - 이전 이벤트 핸들러가 존재하면 제거하고 새 핸들러를 등록합니다.
 */
export function initCesiumTooltipEvent(viewer) {
    if (viewer._tooltipHandler) {
        viewer._tooltipHandler.destroy();
    }

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    viewer._tooltipHandler = handler;

    handler.setInputAction((click) => {
        const picked = viewer.scene.pick(click.position);

        if (
            Cesium.defined(picked) &&
            picked.id?.properties?.wdir != null &&
            picked.id?.properties?.wspd != null &&
            picked.id?.properties?.altitude != null
        ) {
            showTooltip(picked.id, click.position, viewer);
        } else {
            hideTooltip();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}