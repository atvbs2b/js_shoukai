// script.js - スワイプ対応ハンバーガーメニュー版

document.addEventListener('DOMContentLoaded', () => {
    // ハンバーガーメニューの要素を取得
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const header = document.querySelector('header');
    // モバイルメニューとメインナビゲーションのリンクをすべて取得
    const allNavLinks = document.querySelectorAll('#mobile-nav a, #main-nav a');

    // スワイプジェスチャーの設定
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    // スワイプの最小距離（ピクセル）
    const MIN_SWIPE_DISTANCE = 50;
    // 垂直方向の許容範囲（ピクセル）
    const MAX_VERTICAL_DISTANCE = 100;

    // ハンバーガーメニューの表示/非表示を制御する関数
    const toggleMobileMenu = () => {
        if (mobileNav) {
            mobileNav.classList.toggle('active');
        }
    };

    // ハンバーガーメニューを閉じる関数
    const closeMobileMenu = () => {
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
        }
    };

    // ハンバーガーメニューボタンクリック時の処理
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileMenu();
        });
    }

    // タッチイベントの処理（スワイプジェスチャー）
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        handleSwipe();
        isSwiping = false;
    }, { passive: true });

    // スワイプジェスチャーの判定と処理
    const handleSwipe = () => {
        const deltaX = touchEndX - touchStartX;
        const deltaY = Math.abs(touchEndY - touchStartY);
        
        // 垂直方向のスワイプが大きすぎる場合は無視
        if (deltaY > MAX_VERTICAL_DISTANCE) return;
        
        // 右スワイプ（メニューを開く）
        if (deltaX > MIN_SWIPE_DISTANCE && window.innerWidth < 768) {
            if (mobileNav && !mobileNav.classList.contains('active')) {
                mobileNav.classList.add('active');
            }
        }
        
        // 左スワイプ（メニューを閉じる）
        if (deltaX < -MIN_SWIPE_DISTANCE && window.innerWidth < 768) {
            closeMobileMenu();
        }
    };

    // ナビゲーションリンクがクリックされた時の処理
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // 外側をクリックした時にメニューを閉じる
    document.addEventListener('click', (e) => {
        if (mobileNav && mobileNav.classList.contains('active')) {
            if (!hamburgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // ウィンドウリサイズ時にモバイルメニューを閉じる
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });

    // スクロール時のヘッダー固定処理
    let lastScrollTop = 0;
    let scrollThreshold = 10; // スクロールの閾値

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) {
            return;
        }

        if (header) {
            if (scrollTop > 100) {
                // 100px以上スクロールしたらヘッダーを固定
                header.classList.add('fixed-header');
                document.body.classList.add('header-fixed');
            } else {
                // トップ付近に戻ったら固定を解除
                header.classList.remove('fixed-header');
                document.body.classList.remove('header-fixed');
            }
        }

        lastScrollTop = scrollTop;
    };

    // スクロールイベントをスロットル処理で最適化
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(handleScroll, 10);
    });

    // お絵かきボードのロジック
    const drawingCanvas = document.getElementById('drawingCanvas');
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');

    if (drawingCanvas && drawingCanvas.getContext) {
        const ctx = drawingCanvas.getContext('2d');

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const resizeCanvas = () => {
            drawingCanvas.width = drawingCanvas.offsetWidth;
            drawingCanvas.height = drawingCanvas.offsetHeight;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // マウスイベント
        drawingCanvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        drawingCanvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();

            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        drawingCanvas.addEventListener('mouseup', () => isDrawing = false);
        drawingCanvas.addEventListener('mouseout', () => isDrawing = false);

        // タッチイベント（お絵かき用）- メニュースワイプと競合しないよう調整
        drawingCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation(); // メニュースワイプとの競合を防ぐ
            const touch = e.touches[0];
            const rect = drawingCanvas.getBoundingClientRect();
            isDrawing = true;
            [lastX, lastY] = [
                touch.clientX - rect.left,
                touch.clientY - rect.top
            ];
        });

        drawingCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation(); // メニュースワイプとの競合を防ぐ
            if (!isDrawing) return;

            const touch = e.touches[0];
            const rect = drawingCanvas.getBoundingClientRect();
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            [lastX, lastY] = [currentX, currentY];
        });

        drawingCanvas.addEventListener('touchend', (e) => {
            e.stopPropagation(); // メニュースワイプとの競合を防ぐ
            isDrawing = false;
        });
        
        drawingCanvas.addEventListener('touchcancel', (e) => {
            e.stopPropagation();
            isDrawing = false;
        });

        if (clearCanvasBtn) {
            clearCanvasBtn.addEventListener('click', () => {
                ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            });
        }

    } else if (drawingCanvas) {
        const canvasContainer = drawingCanvas.parentElement;
        if (canvasContainer) {
            canvasContainer.innerHTML = '<p class="text-red-500">お使いのブラウザはCanvas要素をサポートしていません。</p>';
        }
    }

    // カウンターアプリケーションのロジック
    const countDisplay = document.getElementById('count-display');
    const decrementBtn = document.getElementById('decrement-btn');
    const incrementBtn = document.getElementById('increment-btn');

    if (countDisplay && decrementBtn && incrementBtn) {
        let count = 0;

        function updateCountDisplay() {
            countDisplay.textContent = count;
        }

        decrementBtn.addEventListener('click', () => {
            count--;
            updateCountDisplay();
        });

        incrementBtn.addEventListener('click', () => {
            count++;
            updateCountDisplay();
        });

        updateCountDisplay();
    }
});