// script.js

document.addEventListener('DOMContentLoaded', () => {
    // ハンバーガーメニューの要素を取得
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    // モバイルメニューとメインナビゲーションのリンクをすべて取得
    const allNavLinks = document.querySelectorAll('#mobile-nav a, #main-nav a');

    // ハンバーガーメニュークリック時の処理
    hamburgerMenu.addEventListener('click', () => {
        // mobile-nav要素に'active'クラスをトグルする
        // 'active'クラスはCSSで定義され、メニューの表示/非表示を制御する
        mobileNav.classList.toggle('active');
    });

    // ナビゲーションリンクがクリックされた時の処理 (モバイルとデスクトップ両方)
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            // モバイルメニューが表示されている場合、リンククリックで閉じる
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
            }
        });
    });

    // Canvas要素の取得と描画処理
    const canvas = document.getElementById('myCanvas');
    // Canvasがサポートされているか確認
    if (canvas && canvas.getContext) { // canvas要素が存在するかどうかも確認
        // 2D描画コンテキストを取得
        const ctx = canvas.getContext('2d');

        // Canvasのサイズを設定
        // CSSで幅を100%に設定しているため、ここではピクセル単位で設定
        // 親要素のサイズに合わせて動的に設定することも可能
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // 赤い四角形を描画
        ctx.fillStyle = 'red'; // 塗りつぶしの色を赤に設定
        // fillRect(x座標, y座標, 幅, 高さ)
        ctx.fillRect(50, 50, 100, 75);

        // 青い円を描画
        ctx.beginPath(); // 新しい描画パスを開始
        // arc(x座標, y座標, 半径, 開始角度, 終了角度, 反時計回りか)
        // 角度はラジアンで指定 (Math.PI * 2 は360度)
        ctx.arc(200, 100, 50, 0, Math.PI * 2, false);
        ctx.fillStyle = 'blue'; // 塗りつぶしの色を青に設定
        ctx.fill(); // 現在のパスを塗りつぶす
        ctx.closePath(); // 現在のパスを閉じる

        // 緑色の線を描画
        ctx.beginPath();
        ctx.moveTo(20, 20); // 描画の開始点
        ctx.lineTo(150, 150); // 描画の終了点
        ctx.strokeStyle = 'green'; // 線の色を緑に設定
        ctx.lineWidth = 3; // 線の太さを設定
        ctx.stroke(); // 線を描画

    } else if (canvas) { // canvas要素は存在するがgetContextが使えない場合
        const canvasContainer = canvas.parentElement;
        canvasContainer.innerHTML = '<p class="text-red-500">お使いのブラウザはCanvas要素をサポートしていません。</p>';
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
