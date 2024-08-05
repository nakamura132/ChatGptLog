// textarea 要素を取得
const textarea = document.getElementById('prompt-textarea');

// send-button 要素を取得
const sendButton = document.querySelector('[data-testid="send-button"]');

// バッファを初期化
let buffer = textarea ? textarea.value : '';
let backupBuffer = buffer;

if (textarea) {
  // input イベントのリスナーを追加
  textarea.addEventListener('input', () => {
    // バッファを更新
    buffer = textarea.value;
  });
}

// MutationObserver を使って send-button の disabled 属性の変更を監視
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'disabled') {
      // send-button が活性から非活性に変わったとき
      if (sendButton && sendButton.disabled) {
        // バッファとバックアップバッファを比較
        if (buffer !== backupBuffer) {
          // 現在日時を取得
          const now = new Date();
          const dateString = now.toISOString().replace(/[:.]/g, '-');
          // ファイル名に「chatgpt」を含める
          const fileName = `chatgpt-log-${dateString}.txt`;

          // Blobオブジェクトを作成
          const blob = new Blob([buffer], { type: 'text/plain' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);

          // バックアップバッファに内容をコピー
          backupBuffer = buffer;
        }
      }
    }
  });
});

if (sendButton) {
  // send-button の disabled 属性の変更を監視
  observer.observe(sendButton, { attributes: true });
}
