// script.js

document.addEventListener('DOMContentLoaded', () => {
    // ハンバーガーメニューの要素を取得
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    // モバイルメニューとメインナビゲーションのリンクをすべて取得
    const allNavLinks = document.querySelectorAll('#mobile-nav a, #main-nav a');

    // ハンバーガーメニュークリック時の処理
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', (e) => {
            e.preventDefault();
            mobileNav.classList.toggle('active');
        });
    }

    // ナビゲーションリンクがクリックされた時の処理
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            // モバイルメニューが表示されている場合、リンククリックで閉じる
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
            }
        });
    });

    // 外側をクリックした時にメニューを閉じる
    document.addEventListener('click', (e) => {
        if (mobileNav && mobileNav.classList.contains('active')) {
            if (!hamburgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
            }
        }
    });

    // ウィンドウリサイズ時にモバイルメニューを閉じる
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
        }
    });

    // お絵かきボードのロジック
    const drawingCanvas = document.getElementById('drawingCanvas');
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');

    if (drawingCanvas && drawingCanvas.getContext) {
        const ctx = drawingCanvas.getContext('2d');

        let isDrawing = false; // 描画中かどうかを示すフラグ
        let lastX = 0; // 最後に描画したX座標
        let lastY = 0; // 最後に描画したY座標

        // キャンバスのサイズを親要素に合わせて設定する関数
        const resizeCanvas = () => {
            // CSSで設定された表示サイズに合わせて、Canvasの内部解像度を設定
            drawingCanvas.width = drawingCanvas.offsetWidth;
            drawingCanvas.height = drawingCanvas.offsetHeight;
            // 解像度変更後に線のスタイルを再設定（リセットされるため）
            ctx.strokeStyle = '#000000'; // 黒色
            ctx.lineWidth = 3; // 線の太さ
            ctx.lineJoin = 'round'; // 線と線の結合部分を丸くする
            ctx.lineCap = 'round'; // 線の端を丸くする
        };

        // 初期ロード時とウィンドウリサイズ時にキャンバスのサイズを設定
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 線のスタイルを設定
        // resizeCanvas関数内で設定済みだが、念のためここでも設定
        ctx.strokeStyle = '#000000'; // 黒色
        ctx.lineWidth = 3; // 線の太さ
        ctx.lineJoin = 'round'; // 線と線の結合部分を丸くする
        ctx.lineCap = 'round'; // 線の端を丸くする

        // マウスが押された時の処理
        drawingCanvas.addEventListener('mousedown', (e) => {
            e.preventDefault(); // デフォルトの動作（テキスト選択など）を防ぐ
            isDrawing = true;
            // offsetX, offsetYはイベント発生要素の左上からの相対座標
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        // マウスが動いた時の処理
        drawingCanvas.addEventListener('mousemove', (e) => {
            e.preventDefault(); // デフォルトの動作を防ぐ
            if (!isDrawing) return; // 描画中でなければ何もしない

            ctx.beginPath(); // 新しいパスを開始
            ctx.moveTo(lastX, lastY); // 前回の位置から開始
            ctx.lineTo(e.offsetX, e.offsetY); // 現在の位置まで線を引く
            ctx.stroke(); // 線を描画

            // 現在の位置を次の開始点として記録
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        // マウスが離れた時、またはキャンバスから出た時の処理
        drawingCanvas.addEventListener('mouseup', () => isDrawing = false);
        drawingCanvas.addEventListener('mouseout', () => isDrawing = false);

        // キャンバスをクリアするボタンのイベントリスナー
        if (clearCanvasBtn) {
            clearCanvasBtn.addEventListener('click', () => {
                ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); // キャンバス全体をクリア
            });
        }

    } else if (drawingCanvas) {
        // Canvas要素は存在するがgetContextが使えない場合
        const canvasContainer = drawingCanvas.parentElement;
        if (canvasContainer) {
            canvasContainer.innerHTML = '<p class="text-red-500">お使いのブラウザはCanvas要素をサポートしていません。</p>';
        }
    }

    // カウンターアプリケーションのロジック
    const countDisplay = document.getElementById('count-display');
    const decrementBtn = document.getElementById('decrement-btn');
    const incrementBtn = document.getElementById('increment-btn');

    // カウンター関連の要素が存在する場合のみ処理を実行
    if (countDisplay && decrementBtn && incrementBtn) {
        let count = 0; // カウンターの初期値

        // カウント表示を更新する関数
        function updateCountDisplay() {
            countDisplay.textContent = count;
        }

        // デクリメントボタンのイベントリスナー
        decrementBtn.addEventListener('click', () => {
            count--; // カウントを減らす
            updateCountDisplay(); // 表示を更新
        });

        // インクリメントボタンのイベントリスナー
        incrementBtn.addEventListener('click', () => {
            count++; // カウントを増やす
            updateCountDisplay(); // 表示を更新
        });

        updateCountDisplay(); // ページ読み込み時に初期値を表示
    }
});