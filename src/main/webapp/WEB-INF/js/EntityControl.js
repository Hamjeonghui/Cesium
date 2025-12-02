/*
    Cesium 맵, 레이어 객체 조작 관련
 */
import { viewer } from './MapControl.js';
import { filterState } from './FilterControl.js';
import { deviceModels, getWindColor } from './Constans.js';

const BOX_HEIGHT = 91.44; // 300ft in meters
const entityMap = {
    arrow: [],
    box: [],
    guide: []
};

/**
 * 지정된 타입(box, arrow, guide)의 도형을 지도에서 제거합니다.
 *
 * @param {'arrow' | 'box' | 'guide'} type - 제거할 도형의 종류
 */
export function clearEntity(type) {
    entityMap[type].forEach(e => viewer.entities.remove(e));
    entityMap[type].length = 0;
}

/**
 * 장비별 가이드 영역(폴리곤)을 지도에 추가합니다.
 *
 * @param {Object} data - 가이드 데이터 (장비별 폴리곤 좌표 포함)
 * @param {Array<string>} [deviceArry=['AMOS','LLWAS']] - 표출 대상 장비 목록
 */
export function addGridGuide(data, deviceArry = ['AMOS', 'LLWAS']) {
    const color = Cesium.Color.LIGHTGRAY.withAlpha(0.4);
    let mode = Number($('input[name="guide"]:checked').val());
    if (mode === 0) return;

    deviceArry.forEach(category => {
        if (!data[category]) return;

        data[category].forEach(item => {
            const positions = item.coordinate.flatMap(coord => [coord[1], coord[0]]);
            const baseHeight = item.alt * 0.3048;
            const boxHeight = 10;

            const polygonEntity = viewer.entities.add({
                name: `[${category}] ${item.name}(guide)`,
                tooltip: "??",
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(positions),
                    height: baseHeight,
                    extrudedHeight: baseHeight + boxHeight,
                    material: color,
                    outline: true,
                    outlineColor: Cesium.Color.GRAY,
                },
                label: {
                    text: item.name,
                    font: '12px sans-serif',
                    fillColor: Cesium.Color.BLACK,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    pixelOffset: new Cesium.Cartesian2(0, -15),
                    position: Cesium.Cartesian3.fromDegrees(item.coordinate[0][1], item.coordinate[0][0])
                },
                properties: { type: 'guide' }
            });

            entityMap.guide.push(polygonEntity);
        });
    });
}

/**
 * heading, pitch, roll 정보를 기반으로 3D 오리엔테이션(quaternion)을 생성합니다.
 *
 * @param {Cesium.Cartesian3} position - 기준 위치
 * @param {number} headingDeg - heading 각도 (도 단위)
 * @param {number} [pitchDeg=0] - pitch 각도 (기본값: 0)
 * @param {number} [rollDeg=0] - roll 각도 (기본값: 0)
 * @returns {Cesium.Quaternion} - 회전 정보가 적용된 orientation 값
 */
function createOrientation(position, headingDeg, pitchDeg = 0, rollDeg = 0) {
    return Cesium.Transforms.headingPitchRollQuaternion(
        position,
        new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(headingDeg),
            Cesium.Math.toRadians(pitchDeg),
            Cesium.Math.toRadians(rollDeg)
        )
    );
}

/**
 * 박스 도형의 엔티티 생성 옵션을 반환합니다.
 *
 * @param {Object} param0 - 엔티티 구성 정보
 * @param {string} param0.name - 이름
 * @param {Cesium.Cartesian3} param0.position - 위치
 * @param {Cesium.Color} param0.color - 색상
 * @param {Array<number>} param0.dimensions - 크기 [x, y, z]
 * @returns {Object} Cesium 엔티티 옵션 객체
 */
function createBoxEntity({ name, position, color, dimensions }) {
    return {
        name,
        position,
        orientation: createOrientation(position, 330),
        box: {
            dimensions: new Cesium.Cartesian3(...dimensions),
            material: color,
            outline: true,
            outlineColor: color
        }
    };
}

/**
 * 화살표(원뿔형) 도형의 엔티티 생성 옵션을 반환합니다.
 *
 * @param {Object} param0 - 엔티티 구성 정보
 * @param {string} param0.name - 이름
 * @param {Cesium.Cartesian3} param0.position - 위치
 * @param {Cesium.Color} param0.color - 색상
 * @param {number} param0.wdir - 풍향 값 (0~360도)
 * @returns {Object} Cesium 엔티티 옵션 객체
 */
function createArrowEntity({ name, position, color, wdir }) {
    return {
        name,
        position,
        orientation: createOrientation(position, (wdir + 270) % 360, -90),
        cylinder: {
            length: 600,
            topRadius: 0,
            bottomRadius: 50,
            material: color
        }
    };
}

/**
 * 풍속 정보를 포함한 박스 도형을 Cesium 지도에 렌더링합니다.
 *
 * @param {Array<Object>} data - 장비 데이터 배열
 * @param {string} deviceType - 장비 종류 (예: 'amos', 'llwas')
 */
export function renderBoxDevices(data, deviceType) {
    const opacity = parseFloat($('#box-opacity > input').val());
    const displayMode = Number($('input[name="box"]:checked').val());

    if (displayMode === 0) return;

    data.forEach(({ name, lon, lat, alt, wspd, wdir }) => {
        if (wspd == null || wdir == null) return;

        const altMeter = alt / 3.281;
        const position = Cesium.Cartesian3.fromDegrees(lon, lat, altMeter);
        const color = getWindColor(wspd, opacity);

        const entity = viewer.entities.add({
            ...createBoxEntity({
                name: `[${deviceType.toUpperCase()}] ${name}(Box)`,
                position,
                color,
                dimensions: [926, 926, BOX_HEIGHT]
            }),
            properties: {
                type: 'box', device: deviceType, name, altitude: alt, wspd, wdir
            }
        });

        entityMap.box.push(entity);
    });
}

/**
 * 풍속/풍향 정보를 포함한 화살표 도형을 Cesium 지도에 렌더링합니다.
 *
 * @param {Array<Object>} data - 장비 데이터 배열
 * @param {string} deviceType - 장비 종류
 */
export function renderArrowDevices(data, deviceType) {
    const opacity = parseFloat($('#arrow-opacity > input').val());
    const displayMode = Number($('input[name="arrowMode"]:checked').val());

    if (displayMode === 0) return;

    data.forEach(({ name, lon, lat, alt, wspd, wdir }) => {
        if (wspd == null || wdir == null) return;

        const altMeter = alt / 3.281;
        const position = Cesium.Cartesian3.fromDegrees(lon, lat, altMeter + BOX_HEIGHT / 2);
        const color = displayMode === 1
            ? Cesium.Color.BLACK.withAlpha(opacity)
            : getWindColor(wspd, opacity);

        const entity = viewer.entities.add({
            ...createArrowEntity({
                name: `[${deviceType.toUpperCase()}] ${name}(Arrow)`,
                position,
                color,
                wdir
            }),
            properties: {
                type: 'arrow', device: deviceType, name, altitude: alt, wspd, wdir
            }
        });

        entityMap.arrow.push(entity);
    });
}

/**
 * 지정된 장비 타입의 3D 모델을 지도에 표시합니다.
 *
 * @param {string} deviceType - 장비 종류 (예: 'AMOS', 'LLWAS')
 */
export function showDeviceModels(deviceType) {
    const basePath = '/models/';
    const device = deviceModels[deviceType];
    if (!device) return;

    const defaultAlt = 10;
    const scale = device.scale || 20;

    device.locations.forEach((loc, idx) => {
        const id = `${deviceType}-${idx + 1}`;
        const position = Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat, defaultAlt);

        viewer.entities.add({
            id,
            name: id,
            position,
            model: {
                uri: basePath + device.modelPath,
                scale,
                minimumPixelSize: scale * 5
            }
        });
    });
}

/**
 * 지정된 장비 타입의 3D 모델을 지도에서 제거합니다.
 *
 * @param {string} deviceType - 장비 종류
 */
export function removeDeviceModels(deviceType) {
    const device = deviceModels[deviceType];
    if (!device) return;

    device.locations.forEach((_, idx) => {
        const id = `${deviceType}-${idx + 1}`;
        const entity = viewer.entities.getById(id);
        if (entity) viewer.entities.remove(entity);
    });
}

/**
 * 모델 필터 상태(filterState.model)를 기반으로
 * 표시할 장비 모델만 지도에 다시 렌더링합니다.
 */
export function refreshFilteredDeviceModels() {
    Object.keys(deviceModels).forEach(type => removeDeviceModels(type));
    filterState.model.forEach(type => showDeviceModels(type));
}