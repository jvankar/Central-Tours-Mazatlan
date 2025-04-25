
document.addEventListener("DOMContentLoaded", () => {
    const whatsappContainer = document.getElementById('lottie-whatsapp');
    const whatsappLink = document.getElementById('whatsapp-link');

    
    if (!whatsappContainer) return;

   
    lottie.loadAnimation({
        container: whatsappContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'material/json/whatsapp-icon.json' 
    });

    
    if (whatsappLink) {
        whatsappLink.href = ""; 
    }
});