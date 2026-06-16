(function() {
    // Prevent double injection
    if (window.MirrorMagicWidgetLoaded) return;
    window.MirrorMagicWidgetLoaded = true;

    // Config
    const config = window.MirrorMagicWidgetConfig || {
        domain: "https://coach.mirrormagicmethod.com"
    };
    
    const domain = config.domain;

    // Create Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .mm-widget-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2e153b 0%, #b78c2d 100%);
            box-shadow: 0 4px 16px rgba(46, 21, 59, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999999;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid rgba(255, 255, 255, 0.8);
            font-size: 28px;
            user-select: none;
        }
        .mm-widget-btn:hover {
            transform: scale(1.08);
        }
        .mm-widget-container {
            position: fixed;
            bottom: 95px;
            right: 20px;
            width: 420px;
            height: 650px;
            max-height: calc(100vh - 120px);
            max-width: calc(100vw - 40px);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 12px 40px rgba(46, 21, 59, 0.25);
            z-index: 999998;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transform-origin: bottom right;
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .mm-widget-container.active {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }
        .mm-widget-iframe {
            width: 100%;
            height: 100%;
            border: none;
            background: #fff;
        }
    `;
    document.head.appendChild(style);

    // Create Widget Container
    const container = document.createElement('div');
    container.className = 'mm-widget-container';
    
    const iframe = document.createElement('iframe');
    iframe.className = 'mm-widget-iframe';
    iframe.src = domain;
    iframe.allow = "camera; microphone"; // Allow camera access inside iframe
    container.appendChild(iframe);
    document.body.appendChild(container);

    // Create Widget Button
    const btn = document.createElement('div');
    btn.className = 'mm-widget-btn';
    btn.innerHTML = '🪞'; // Mirror emoji
    
    btn.addEventListener('click', () => {
        container.classList.toggle('active');
        if (container.classList.contains('active')) {
            btn.innerHTML = '✕';
            btn.style.fontSize = '22px';
            btn.style.color = '#ffffff';
        } else {
            btn.innerHTML = '🪞';
            btn.style.fontSize = '28px';
        }
    });

    document.body.appendChild(btn);
})();
