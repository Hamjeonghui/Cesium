/*
    필터 조작 관련 로직
 */
import { viewer } from './MapControl.js';
import { refreshFilteredDeviceModels } from "./EntityControl.js";

// ✅ 필터 상태를 하나의 객체로 통합
export const filterState = {
    device: new Set(),
    alt: new Set(),
    model: new Set()
};

/**
 * 필터 체크박스의 초기 체크 상태를 기반으로
 * filterState 객체(device, alt, model)를 초기화합니다.
 *
 * 페이지 로딩 직후 실행되어야 하며,
 * 이후 필터 기반 렌더링 함수들과 함께 호출됩니다.
 *
 * @function initializeFilterStateFromDOM
 * @example
 * initializeFilterStateFromDOM();
 * applyCombinedFilters();
 * refreshFilteredDeviceModels();
 */
export function initializeFilterStateFromDOM() {
    ['device', 'alt', 'model'].forEach(filterType => {
        const selector = `input[data-${filterType}]:checked`;
        const targetSet = filterState[filterType];

        $(selector).each(function () {
            let value = $(this).data(filterType);
            if (filterType === 'alt') value = Number(value);
            targetSet.add(value);
        });
    });
}

/**
 * 필터 UI 영역(패널)을 접거나 펼칩니다.
 *
 * @function toggleFilter
 * @description
 * - '#filter-container'에 'hide' 클래스를 토글하여
 * 필터 박스를 숨기거나 보이도록 설정합니다.
 */
export function toggleFilter() {
    const $container = $('#filter-container');
    const $toggleBtn = $container.find('.toggle-button');

    const isHidden = $container.hasClass('hide');
    $container.toggleClass('hide', !isHidden);
    $toggleBtn.toggleClass('flipped', !isHidden);
}

/**
 * 단일 필터 항목(device, alt, model)에 대해
 * 체크 여부에 따라 filterState를 업데이트합니다.
 *
 * @function toggleFilterItem
 * @param {'device' | 'alt' | 'model'} type - 필터 타입
 * @param {string} value - 필터 값
 * @param {boolean} checked - true일 경우 추가, false일 경우 제거
 */
export function toggleFilterItem(type, value, checked) {
    if (checked) filterState[type].add(value);
    else filterState[type].delete(value);
}

/**
 * 현재 활성화된 필터(device, alt)를 기준으로
 * Cesium 엔티티(box, arrow)의 표시 여부를 갱신합니다.
 *
 * @function applyCombinedFilters
 * @description
 * viewer.entities 내의 box 및 arrow 엔티티만 필터 대상이며,
 * 기타 guide나 모델은 영향을 받지 않습니다.
 */
export function applyCombinedFilters() {
    const { device, alt } = filterState;

    viewer.entities.values.forEach(entity => {
        if (!entity.properties) return;

        const type = entity.properties.type?._value;
        if (type !== 'box' && type !== 'arrow') return;

        const deviceValue = entity.properties.device?._value;
        const altitudeValue = entity.properties.altitude?._value;

        const isVisible = device.has(deviceValue) && alt.has(altitudeValue);
        entity.show = isVisible;
    });
}

/**
 * 특정 필터 그룹(device, alt, model)에 대해
 * 전체 선택 또는 전체 해제를 수행하고 filterState를 동기화합니다.
 *
 * @function checkAll
 * @param {'device' | 'alt' | 'model'} filterType - 필터 그룹 종류
 * @param {boolean} checked - true면 전체 선택, false면 전체 해제
 *
 * @description
 * - model 필터는 refreshFilteredDeviceModels() 호출
 * - 그 외(device, alt)는 applyCombinedFilters() 호출
 */
export function checkAll(filterType, checked) {
    const targetSet = filterState[filterType];
    const selector = `.filter-${filterType}`;

    targetSet.clear(); // 기존 필터 초기화

    $(selector).each(function () {
        let value = $(this).data(filterType);
        this.checked = checked;

        if (checked) targetSet.add(value);
    });

    // box/arrow vs model 처리 구분
    if (filterType === 'model') {
        refreshFilteredDeviceModels();
    } else {
        applyCombinedFilters();
    }
}

