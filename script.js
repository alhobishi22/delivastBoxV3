let driverImage; // صورة السائق
let openBoxImage; // صورة الصندوق المفتوح
let foodImage, giftImage, cakeImage, electronicImage; // صور محتويات الصندوق
let driverX = 0; // موقع السائق الأفقي
let roadLineOffset = 0; // إزاحة خطوط الطريق
let boxOpened = false; // حالة الصندوق (مغلق أو مفتوح)
let gifts = []; // قائمة الهدايا والأطعمة
let selectedItem = null; // العنصر الذي تم اختياره لتسجيله
let isStopped = false; // حالة الدراجة (متحركة أو متوقفة)
let probabilities = { food: 0.25, gift: 0.25, cake: 0.25, electronic: 0.5 }; // احتمالات ظهور العناصر (الغذاء: 25%, الهدية: 25%, الكعكة: 25%, الإلكترونيات: 25%) // احتمالات ظهور العناصر

function preload() {
    // تحميل الصور المرفقة
    driverImage = loadImage(
        'https://uc1e14c63aeb567eadda4181ba8a.previews.dropboxusercontent.com/p/thumb/ACaAmK0ai2tmT3cbA3s_heZICQC-NPKxajUNuoOq8P6EcUsxdysDkNpfYaDiRZ71GDJQ4gRBNZieA5E1Nl47C2n-MJuf_37PMlxncA7lHMwIQu96b7n44YybuoCEONtki6wheT-DX3wy2MMcI7gttfrKqEkubVL3O33nUiPhgZfEeTUWEdd_4poKzJgQn3iwZwg2c--mZFQ41kHfNzyluErWZtvA_6HNlp2JxeVjAPeJMz6FwiosTpb991ro63gg9vjKIpHzky_EK2fXy0QvvWJfCpt_1ucUIGc_UkeBtwkpHXmp15DfNkl_kz2YJpu_kmOf5jk43Faa_d0_bhlQCAOhHoH7qtFkUwn4fdF_jbBz37MpUPJJ2Q8CGCht0sbxHS8/p.png?is_prewarmed=true', 
        () => {
            console.log('تم تحميل صورة السائق بنجاح');
        },
        () => {
            console.error('خطأ: لم يتم العثور على صورة السائق! تحقق من المسار.');
        }
    );
    openBoxImage = loadImage(
        'https://uc9741bd9b4a55ff6545ba1ee2fe.previews.dropboxusercontent.com/p/thumb/ACZfzhwJNFJKVE87rxHbso9WtKRAFuPyY2GQuRPrJDCPexmb3wV0JrSXuURcuuw97QXVxErWMu5OswIpFksjz8tem8HRazhrHaenDosaeTUyx01lFHlUxPeA6asA6OIwjBHvwRQO31xvUSmjhodUWkA7locu5QsnYnRmN3PCcx3FkqO-unkwNq2z_dlkQVeQ8GmHNwwALfyBhg5gULLzdTdlMI8N5svCVPw3v5-PePsQnORy0swQtg_uaT6-W-YSle2W55X5AoHcA7f3Tveiw-uwlxqrqjKMr7vOCWHm3kxuN2KK8dQtcyXDzyeTS8MHt58sPSxve_w5huUpm8aARATDSPBRKsogQTSIehjeB4lb9QhEllAFgktkNYXqaPFDduw/p.png?is_prewarmed=true',
        () => {
            console.log('تم تحميل صورة الصندوق المفتوح بنجاح');
        },
        () => {
            console.error('خطأ: لم يتم العثور على صورة الصندوق المفتوح! تحقق من المسار.');
        }
    );
    foodImage = loadImage('https://cdn-icons-png.flaticon.com/512/10366/10366416.png');
    giftImage = loadImage('https://cdn-icons-png.flaticon.com/512/997/997499.png');
    cakeImage = loadImage('https://cdn-icons-png.flaticon.com/512/3631/3631167.png');
    electronicImage = loadImage('https://uc3533c4ecf4c920893ceadf551c.previews.dropboxusercontent.com/p/thumb/ACaQ4WHgkKbHo7HLQC-WYyxAsJdE0xjhxtODyC2J8ZemIpSdDpXEQ16nLzeHSpUnBhwGlPispP6emqpBDbFQEJ7I7K6af83QKAk8B8e_HZhrrJo4BDZxCvTnSP1_RqW4qYauMffWU6fQGb1N5Wprbh1K6EEs-LPq9FR825ZWX1ePH3DyAZajVLZbd7wgA4vLYONr-9R075KC_95wXz8aypr0q-bKS1uFO9GgXcHUvSOCJyuMZ7o5Qt_A3JZJIMgdi-ppm22aA8ClNn3qD-lIiF-FrqtRDdqcbHjPLgckyMzGq5zwxY3mLI9C-z31qbwY6NCRXOCqkgMMoRU9p945ilGS0Ca32S0c1x_5MIs242ZMheKEcjoh3pKVaOaH_XsuDgY/p.png?is_prewarmed=true');
}

function setup() {
    windowResized(); // تحديث حجم اللوحة عند الفتح
    // تحديد مكان رسم الرسوم المتحركة داخل الصفحة
    let canvas = createCanvas(windowWidth, 600);
    canvas.parent('animation-section'); // ربط اللوحة بالقسم المحدد
}

function windowResized() {
    resizeCanvas(windowWidth, 600); // تحديث حجم اللوحة بناءً على عرض الشاشة
}

function draw() {
    if (!driverImage) {
        return; // إذا لم يتم تحميل الصورة، لا نكمل الرسم
    }

    clear(); // مسح الخلفية لجعلها شفافة تمامًا
    drawRoad();
    drawDeliveryDriver(driverX, 350);

    if (boxOpened) {
        drawGifts(); // رسم الهدايا والأطعمة إذا كان الصندوق مفتوحاً
    }

    // تحريك السائق والطريق إذا لم يكن متوقفًا
    if (!isStopped) {
        driverX += 3; // زيادة الموقع الأفقي لجعل السائق يتحرك
        if (driverX > width) { // إذا خرج السائق من الشاشة يعود من الطرف الآخر
            driverX = -driverImage.width * 0.5;
        }

        // تحريك خطوط الطريق
        roadLineOffset -= 5;
        if (roadLineOffset < -40) {
            roadLineOffset = 0;
        }
    }
}

// رسم الطريق
function drawRoad() {
    fill(169, 169, 169); // لون الطريق
    rect(0, 450, width, 150);

    // خطوط الطريق البيضاء
    stroke(255);
    strokeWeight(4);
    for (let i = roadLineOffset; i < width; i += 40) {
        line(i, 525, i + 20, 525);
    }
}

// رسم سائق التوصيل
function drawDeliveryDriver(x, y) {
    if (boxOpened && openBoxImage) {
        tint(255, 255); // إزالة أي تعديل على الألوان
        image(openBoxImage, x, y, driverImage.width * 0.5, driverImage.height * 0.5); // رسم الصورة مع الصندوق المفتوح
    } else {
        tint(255, 255); // إزالة أي تعديل على الألوان
        image(driverImage, x, y, driverImage.width * 0.5, driverImage.height * 0.5); // رسم الصورة بنسبة تصغير 50%
    }
}

// رسم الهدايا
function drawGifts() {
    for (let i = 0; i < gifts.length; i++) {
        let gift = gifts[i];
        tint(255, 255); // إزالة أي تعديل على الألوان
        image(gift.img, gift.x, gift.y, gift.size, gift.size); // رسم الهدايا باستخدام الصور
        if (gift.y > 100) { // الصعود إلى الأعلى بشكل تدريجي بزاوية 120 درجة
            gift.x += Math.cos(radians(120)) * 2;
            gift.y -= Math.sin(radians(120)) * 2;
        } else {
            gift.y = 100; // تثبيت الهدايا في موضع معين في السماء
        }
    }
}

// التعامل مع حدث النقر بالماوس
function mousePressed() {
    // تحقق مما إذا كان النقر داخل منطقة السائق
    if (
        mouseX > driverX &&
        mouseX < driverX + driverImage.width * 0.5 &&
        mouseY > 350 &&
        mouseY < 350 + driverImage.height * 0.5
    ) {
        isStopped = !isStopped; // تبديل حالة الدراجة بين التوقف والحركة

        if (isStopped) {
            // تسجيل العنصر الذي تم اختياره في localStorage
            if (selectedItem) {
                localStorage.setItem('lastSelectedGift', selectedItem);
                console.log('تم تسجيل العنصر المختار: ' + selectedItem);
            }
            boxOpened = true; // فتح الصندوق عند التوقف

            // إضافة هدية واحدة بشكل عشوائي باستخدام الاحتمالات
            gifts = [];
            selectedItem = getItemBasedOnSpecificProbability();
            let randomItem = selectedItem;
            gifts.push({
                x: driverX, // تعديل موضع X للهدية
                y: 345, // تحديد موضع الهدية عند فتح الصندوق لتكون في الأعلى
                size: 50,
                img: randomItem
            });
        } else {
            // إعادة تعيين الحالة عند النقر مرة أخرى
            boxOpened = false;
            gifts = [];
        }
    }
}

// دالة لاختيار عنصر بناءً على الاحتمالات المحددة
function getItemBasedOnSpecificProbability() {
    let rand = Math.random() * 100;
    if (rand < probabilities.food * 100) {
        localStorage.setItem('selectedGift', 'food');
    return foodImage;
    } else if (rand < (probabilities.food + probabilities.gift) * 100) {
        localStorage.setItem('selectedGift', 'gift');
    return giftImage;
    } else if (rand < (probabilities.food + probabilities.gift + probabilities.cake) * 100) {
        localStorage.setItem('selectedGift', 'cake');
    return cakeImage;
    } else {
        localStorage.setItem('selectedGift', 'electronic');
    return electronicImage;
    }
}
        
