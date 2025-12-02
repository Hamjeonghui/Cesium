// constants.js
export const TILE_LAYER_URL = 'http://<IP>:8089/osm_tiles2/{z}/{x}/{y}.png';
export const DEFAULT_CAMERA_POS = [126.491, 33.505, 25000]; // 제주공항 중심 좌표

const windColorMap = {
    90: '#333333',
    88: '#FF0000',
    86: '#FC0019',
    84: '#F9003F',
    82: '#F5006B',
    80: '#EF00A2',
    78: '#7F00BF',
    76: '#8700CE',
    74: '#9200E4',
    72: '#A000F7',
    70: '#AD07FF',
    68: '#B722FF',
    66: '#C23EFF',
    64: '#CD61FF',
    62: '#DA87FF',
    60: '#E5ACFF',
    58: '#BF0000',
    56: '#C80000',
    54: '#D50000',
    52: '#E30000',
    50: '#EE0B0B',
    48: '#F32121',
    46: '#F63E3E',
    44: '#F86060',
    42: '#FA8585',
    40: '#FCABAB',
    38: '#008000',
    36: '#008E00',
    34: '#00A400',
    32: '#00BD00',
    30: '#00D500',
    28: '#08E908',
    26: '#1EF31E',
    24: '#40F940',
    22: '#69FC69',
    20: '#96FE96',
    18: '#0077B3',
    16: '#0080C4',
    14: '#008DDE',
    12: '#009DF6',
    10: '#07ABFF',
    8:  '#1FB5FF',
    6:  '#3EC1FF',
    4:  '#61CDFF',
    2:  '#87D9FF',
    0:  '#ACE5FF'
};

export const deviceModels = {
    AMOS: {
        modelPath: 'AMOS.glb',
        locations: [
            { name: "R07", lat: 33.502692, lon: 126.471227 },
            { name: "R25", lat: 33.514036, lon: 126.493535 }
        ]
    },
    LLWAS: {
        modelPath: 'LLWAS.glb',
        locations: [
            { name: "1", lat: 33.50494722, lon: 126.4926111 }
        ]
    },
    LIDAR: {
        modelPath: 'LIDAR.glb',
        locations: [
            { name: "25_1NM", lat: 33.514036, lon: 126.513524 }
        ]
    },
    WPR: {
        modelPath: 'WPR.glb',
        locations: [
            { name: "제주공항 1", lat: 33.487442, lon: 126.436547 },
            { name: "제주공항 2", lat: 33.517210, lon: 126.517036 }
        ]
    }
};

/**
 * 주어진 풍속(wspd)에 따라 색상 맵에서 해당 색상을 찾아 Cesium 색상 객체로 반환합니다.
 *
 * @function getWindColor
 * @param {number} wspd - 풍속 (단위: kt). 정수로 반올림하여 색상 매핑 기준으로 사용됩니다.
 * @param {number} [alpha=1] - 불투명도 (0.0 ~ 1.0). 기본값은 1 (완전 불투명)
 * @returns {Cesium.Color} - Cesium에서 사용 가능한 색상 객체 (알파 포함)
 *
 * @description
 * - 풍속이 클수록 색상 맵 상에서 더 강한 색상으로 매핑됩니다.
 * - 가장 가까운 기준값 이상을 찾아서 색상을 반환하며,
 *   기준값보다 작으면 최소 풍속(0)에 해당하는 색상이 반환됩니다.
 *
 * @example
 * const color = getWindColor(37, 0.8); // 풍속 37kt에 해당하는 색상 반환
 */
export function getWindColor(wspd, alpha = 1) {
    const speed = Math.round(wspd);
    const keys = Object.keys(windColorMap).map(Number).sort((a, b) => b - a);

    for (const k of keys) {
        if (speed >= k) {
            return Cesium.Color.fromCssColorString(windColorMap[k]).withAlpha(alpha);
        }
    }

    return Cesium.Color.fromCssColorString(windColorMap[0]).withAlpha(alpha);
}