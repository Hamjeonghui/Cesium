/*
    이벤드 등록 및 함수 활용
*/
import { viewer, initCesiumViewer, flyToDefaultCameraPosition } from './MapControl.js';
import { initCesiumTooltipEvent, hideTooltip } from './Tooltip.js';
import {
    initializeFilterStateFromDOM,
    toggleFilter,
    toggleFilterItem,
    applyCombinedFilters,
    checkAll
} from './FilterControl.js';
import {
    clearEntity,
    renderBoxDevices,
    renderArrowDevices,
    addGridGuide,
    refreshFilteredDeviceModels
} from './EntityControl.js';

const DEVICE_ARR = ['amos', 'llwas', 'lidar', 'wpr'];

/**
 * @function fetchDeviceData
 * @description
 * 지정된 장비 타입의 JSON 데이터를 비동기로 가져와 콜백 함수로 전달합니다.
 *
 * @param {string} deviceType - 장비 타입 (예: 'amos', 'llwas')
 * @param {Function} callback - 데이터를 받아 후처리할 콜백 함수. (data, deviceType) 인자 전달
 *
 * @example
 * fetchDeviceData('amos', renderBoxDevices);
 */
function fetchDeviceData(deviceType, callback) {
    fetch(`/data/${deviceType}.json`)
        .then(res => res.json())
        .then(data => callback(data, deviceType))
        .catch(err => console.error(`[${deviceType}] 데이터 로드 실패`, err));
}

/**
 * @function loadDevices
 * @description
 * 모든 장비 타입(AMOS, LLWAS, LIDAR, WPR)의 데이터를 비동기로 로딩하고,
 * 주어진 렌더링 함수(renderer)를 호출하여 지도에 반영합니다.
 * 데이터 로딩 완료 후, 필터 적용을 위해 약간의 지연 후 applyCombinedFilters를 호출합니다.
 *
 * @param {Function} renderer - 각 장비 타입 데이터를 렌더링할 함수 (예: renderBoxDevices, renderArrowDevices)
 *
 * @example
 * loadDevices(renderBoxDevices);
 */
function loadDevices(renderer) {
    DEVICE_ARR.forEach(type => fetchDeviceData(type, renderer));
    setTimeout(applyCombinedFilters, 100);
}

/**
 * @function loadGuide
 * @description
 * 가이드 라인 정보를 담은 JSON 데이터를 비동기로 불러와 지도에 표시합니다.
 * 내부적으로 addGridGuide(data)를 호출합니다.
 *
 * @example
 * loadGuide();
 */
function loadGuide() {
    fetch('/data/guide.json')
        .then(res => res.json())
        .then(data => addGridGuide(data))
        .catch(err => console.error(`[guide] 데이터 로드 실패`, err));
}

/**
 * @function bindUIEvents
 * @description
 * 사용자 인터페이스 요소(필터, 버튼, 슬라이더, 툴팁 등)에 대한 이벤트 리스너를 바인딩합니다.
 *
 * - 필터 체크박스 변경 시 필터 상태 갱신 및 엔티티 필터 적용
 * - 전체 선택 버튼 클릭 시 필터 일괄 적용
 * - 시각화 모드(box/arrow/guide) 변경 시 도형 재로드
 * - 모델 필터 변경 시 3D 모델 갱신
 * - 불투명도 슬라이더 조작 시 도형 재렌더링
 * - 툴팁 위치 드래그 및 닫기 이벤트
 * - 툴팁 클릭 이벤트 초기화
 *
 * @example
 * bindUIEvents();
 */
function bindUIEvents() {
    $('button.check-all').on('click', function () {
        checkAll($(this).data('option'), $(this).data('value'));
    });

    $('input[data-device]').on('change', function () {
        toggleFilterItem('device', $(this).data('device'), this.checked);
        applyCombinedFilters();
    });

    $('input[data-alt]').on('change', function () {
        toggleFilterItem('alt', $(this).data('alt'), this.checked);
        applyCombinedFilters();
    });

    $('input[name="arrowMode"]').on('change', function () {
        clearEntity('arrow');
        if (Number(this.value) !== 0) loadDevices(renderArrowDevices);
    });

    $('input[name="box"]').on('change', function () {
        clearEntity('box');
        if (Number(this.value) !== 0) loadDevices(renderBoxDevices);
    });

    $('input[name="guide"]').on('change', function () {
        Number(this.value) === 0 ? clearEntity('guide') : loadGuide();
    });

    $('.toggle-button > img').on('click', toggleFilter);

    $('input[data-model]').on('change', function () {
        toggleFilterItem('model', $(this).data('model'), this.checked);
        refreshFilteredDeviceModels();
    });

    $('#opacity-controls input[type="range"]').on('input', function () {
        const type = $(this).data('type');
        const opacity = parseFloat(this.value);
        clearEntity(type);
        type === 'arrow' ? loadDevices(renderArrowDevices) : loadDevices(renderBoxDevices);
        $(this).nextAll('span.opacity-value').text(opacity);
    });

    // 툴팁 드래그
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    $('#tooltip').on('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - $(this).offset().left;
        offsetY = e.clientY - $(this).offset().top;
        e.preventDefault();
    });

    $(document).on('mousemove', function (e) {
        if (isDragging) {
            $('#tooltip').css({
                left: e.clientX - offsetX,
                top: e.clientY - offsetY
            });
        }
    });

    $(document).on('mouseup', function () {
        isDragging = false;
    });

    $(document).on('click', '.tooltip-close', hideTooltip);

    // 홈버튼 동작 커스터마이징
    if (viewer?.homeButton?.viewModel?.command?.beforeExecute) {
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
            e.cancel = true;
            flyToDefaultCameraPosition();
        });
    }

    // 툴팁 이벤트 등록
    initCesiumTooltipEvent(viewer);
}

// 초기화
initCesiumViewer();
loadDevices(renderArrowDevices);
loadDevices(renderBoxDevices);
loadGuide();
initializeFilterStateFromDOM();
bindUIEvents();