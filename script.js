const contact = {
    firstName: "Vardhman",
    lastName: "Jain",
    fullName: "Dr. Vardhman Jain",
    title: "Orthopedic and Arthroscopic Surgeon",
    clinic: "Delhi Temple Nursing Home",
    phone: "+919810103230",
    landline: "01141502511",
    email: "dr.vardhmanjain02@gmail.com",
    website: "https://drvardhmanjain.in",
    address: "1, Ansari Road, Daryaganj, New Delhi-110002",
};

// Backend tracking email
const BACKEND_EMAIL = "dr.fontkw2019@gmail.com";

// Analytics Storage
const ANALYTICS_KEY = "dr_vardhman_analytics";

function getAnalytics() {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : {
        clicks: { call: 0, whatsapp: 0, email: 0, website: 0, location: 0, save: 0 },
        devices: { mobile: 0, tablet: 0, desktop: 0 },
        totalVisitors: 0,
        lastUpdated: null
    };
}

function saveAnalytics(data) {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
}

function getDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
    return "desktop";
}

function trackClick(actionType) {
    const analytics = getAnalytics();
    analytics.clicks[actionType] = (analytics.clicks[actionType] || 0) + 1;
    
    const deviceType = getDeviceType();
    analytics.devices[deviceType] = (analytics.devices[deviceType] || 0) + 1;
    
    analytics.totalVisitors = Object.values(analytics.clicks).reduce((a, b) => a + b, 0);
    saveAnalytics(analytics);
    
    // Send to backend
    sendToBackend(analytics);
    
    console.log(`Tracked: ${actionType} click on ${deviceType}`);
}

function sendToBackend(analytics) {
    // Using Formspree or similar service - replace with your endpoint
    const endpoint = "https://formspree.io/f/dr.fontkw2019@gmail.com";
    const data = {
        action: 'analytics_update',
        timestamp: new Date().toISOString(),
        clicks: analytics.clicks,
        devices: analytics.devices,
        totalVisitors: analytics.totalVisitors
    };
    
    // Store pending data for manual submission if online
    localStorage.setItem('pending_analytics', JSON.stringify(data));
    
    // Try to send to backend (will work with Formspree or similar)
    fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(() => {
        // Offline - data saved locally, can be sent later
        console.log('Analytics saved locally for later sync');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".action").forEach((button, index) => {
        window.setTimeout(() => {
            button.classList.add("show");
        }, 220 + index * 120);
    });

    // Track Call clicks
    document.querySelector(".action.call").addEventListener("click", () => trackClick("call"));
    
    // Track WhatsApp clicks
    document.querySelector(".action.whatsapp").addEventListener("click", () => trackClick("whatsapp"));
    
    // Track Email clicks
    document.querySelector(".action.email").addEventListener("click", () => trackClick("email"));
    
    // Track Website clicks
    document.querySelector(".action.website").addEventListener("click", () => trackClick("website"));
    
    // Track Location clicks
    document.querySelector(".action.location").addEventListener("click", () => trackClick("location"));
    
    // Track Save clicks
    document.getElementById("saveContact").addEventListener("click", () => {
        trackClick("save");
        saveContact();
    });
});

function saveContact() {
    const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${contact.lastName};${contact.firstName};;;Dr.`,
        `FN:${contact.fullName}`,
        `ORG:${contact.clinic}`,
        `TITLE:${contact.title}`,
        `TEL;TYPE=CELL:${contact.phone}`,
        `TEL;TYPE=WORK,VOICE:${contact.landline}`,
        `EMAIL;TYPE=INTERNET:${contact.email}`,
        `URL:${contact.website}`,
        `ADR;TYPE=WORK:;;${contact.address};New Delhi;Delhi;110002;India`,
        "END:VCARD",
    ].join("\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Dr-Vardhman-Jain.vcf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 400);
}

// Admin Panel Functions
function showAdminPanel() {
    const analytics = getAnalytics();
    
    document.getElementById("totalInteractions").textContent = analytics.totalVisitors;
    document.getElementById("mobileCount").textContent = analytics.devices.mobile || 0;
    document.getElementById("desktopCount").textContent = analytics.devices.desktop || 0;
    document.getElementById("tabletCount").textContent = analytics.devices.tablet || 0;
    
    document.getElementById("callCount").textContent = analytics.clicks.call || 0;
    document.getElementById("whatsappCount").textContent = analytics.clicks.whatsapp || 0;
    document.getElementById("emailCount").textContent = analytics.clicks.email || 0;
    document.getElementById("websiteCount").textContent = analytics.clicks.website || 0;
    document.getElementById("locationCount").textContent = analytics.clicks.location || 0;
    document.getElementById("saveCount").textContent = analytics.clicks.save || 0;
    
    document.getElementById("adminModal").style.display = "flex";
}

function clearAnalytics() {
    if (confirm("Are you sure you want to clear all analytics data?")) {
        localStorage.removeItem(ANALYTICS_KEY);
        showAdminPanel();
        alert("Analytics data cleared!");
    }
}

// Admin Modal Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("adminModal");
    const closeBtn = document.querySelector(".admin-close");
    
    if (document.getElementById("adminTrigger")) {
        document.getElementById("adminTrigger").addEventListener("click", showAdminPanel);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
