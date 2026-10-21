const fs = require('fs');

const origCode = fs.readFileSync('chatbot.js', 'utf8');

// Extract original KB
const kbMatch = origCode.match(/const KB = (\[[\s\S]*?\]);\s*const keywordAliases/);
const aliasMatch = origCode.match(/const keywordAliases = (\{[\s\S]*?\});\s*\/\/ Logic/);

if (!kbMatch || !aliasMatch) {
    console.error('Extraction failed!');
    process.exit(1);
}

const kb = eval(kbMatch[1]);
const aliases = eval('(' + aliasMatch[1] + ')');

console.log('Original items count:', kb.length);

// Merge aliases into KB items
const kbMap = new Map();
kb.forEach(item => kbMap.set(item.id, item));

let aliasMergedCount = 0;
for (let key in aliases) {
    if (kbMap.has(key)) {
        let item = kbMap.get(key);
        let existingKws = new Set(item.keywords.map(k => k.toLowerCase().trim()));
        aliases[key].forEach(akw => {
            let clean = akw.toLowerCase().trim();
            if (!existingKws.has(clean)) {
                item.keywords.push(akw);
                existingKws.add(clean);
                aliasMergedCount++;
            }
        });
    }
}
console.log('Total alias keywords merged:', aliasMergedCount);

// New safety items to add for all suggestions & hotlines
const newItems = [
    {
        id: 'cramp_swimming_what_to_do',
        category: 'drowning',
        badge: 'assets/illust_drowning.png',
        keywords: [
            'bị chuột rút khi bơi làm sao',
            'bi chuot rut khi boi lam sao',
            'bị chuột rút khi bơi',
            'chuột rút khi bơi',
            'bơi bị chuột rút làm gì',
            'đang bơi bị chuột rút',
            'xử lý chuột rút khi bơi',
            'bị chuột rút dưới nước',
            'chuột rút khi đang bơi làm gì',
            'cách xử lý khi bị chuột rút'
        ],
        response: '**Khi bị chuột rút dưới nước, em hãy bình tĩnh xử lý theo 4 bước an toàn sau:** 🏊⚠️\n\n1. **Giữ bình tĩnh tối đa:** Tuyệt đối không hoảng loạn hay vùng vẫy mạnh vì càng vùng vẫy sẽ càng nhanh chìm và đau đớn hơn.\n2. **Thả lỏng cơ thể & chuyển sang tư thế nổi ngửa:** Ngửa đầu ra sau, hít một hơi sâu và thả lỏng chân tay để cơ thể tự nổi trên mặt nước.\n3. **Hô to hoặc giơ tay kêu cứu:** Hướng về phía bờ hoặc người lớn cứu hộ xung quanh.\n4. **Duỗi nhẹ cơ bị chuột rút:** Nếu chuột rút ở bắp chân, hãy dùng tay kéo nhẹ các đầu ngón chân gập ngược về phía đầu gối để giãn cơ.\n5. Từ từ bơi bằng hai tay hoặc chờ người hỗ trợ đưa vào bờ!'
    },
    {
        id: 'electrical_fire_water_forbidden',
        category: 'fire',
        badge: 'assets/illust_electric.png',
        keywords: [
            'cháy điện có được dội nước không',
            'chay dien co duoc doi nuoc khong',
            'cháy điện dội nước được không',
            'cháy điện có dập bằng nước không',
            'dội nước vào đám cháy điện',
            'cháy điện chữa thế nào',
            'cháy ổ điện làm sao',
            'cháy đồ điện dập nước',
            'cháy do điện dội nước được không',
            'cháy điện',
            'cháy quạt điện'
        ],
        response: '**Không được dội nước vào đám cháy do điện nhé!** ⚠️⚡\n\nVì nước có thể dẫn điện, làm nguy hiểm hơn và người xung quanh có nguy cơ bị điện giật tử vong.\n\n**Em hãy nhớ các bước xử lý:**\n1. Bình tĩnh và **ngắt ngay nguồn điện** (cầu dao aptomat) nếu ở vị trí an toàn.\n2. **Hô to báo người lớn** xung quanh.\n3. Chỉ dùng bình chữa cháy CO2 hoặc bình bột (tuyệt đối không dùng nước hay chăn ướt khi chưa ngắt điện).\n4. Nhanh chóng di chuyển ra ngoài và gọi số **114** để được đội cứu hỏa giúp đỡ.'
    },
    {
        id: 'pedestrian_crosswalk_safety',
        category: 'traffic',
        badge: 'assets/illust_traffic.png',
        keywords: [
            'đi qua đường thế nào cho an toàn',
            'di qua duong the nao cho an toan',
            'cách qua đường',
            'qua đường an toàn',
            'đi bộ qua đường',
            'sang đường',
            'vạch kẻ đường',
            'khi nào qua đường',
            'đi qua đường',
            'an toàn khi qua đường',
            'đi qua đường an toàn'
        ],
        response: '**Khi đi qua đường, em hãy:** 🚶‍♂️🚦\n\n• **Đi ở vạch kẻ đường** dành cho người đi bộ.\n• **Nhìn trái - phải - trái**, quan sát xe thật cẩn thận trước khi bước xuống lòng đường.\n• **Chỉ đi khi đèn dành cho người đi bộ bật xanh** và khi đường thật an toàn.\n• Giơ cao một tay lên khi qua đường để tài xế dễ dàng quan sát thấy em.\n• **Luôn đi cùng người lớn** nhé!'
    },
    {
        id: 'see_friend_falling_water_screenshot',
        category: 'drowning',
        badge: 'assets/illust_drowning.png',
        keywords: [
            'nếu thấy bạn rơi xuống nước thì làm gì',
            'neu thay ban roi xuong nuoc thi lam gi',
            'thấy bạn rơi xuống nước làm gì',
            'bạn rơi xuống ao làm sao',
            'thấy bạn chìm làm gì',
            'cứu bạn rơi xuống nước',
            'bạn ngã xuống nước',
            'thấy bạn rơi xuống sông',
            'thấy bạn đuối nước thì làm gì',
            'nếu thấy bạn rơi xuống nước'
        ],
        response: '**Khi thấy bạn rơi xuống nước, em không nên nhảy xuống cứu bạn.** 🛟⚠️\n\nHãy **hét to để gọi người lớn**, tìm **vật nổi** (như phao, can nhựa, dây, cành cây...) để ném xuống cho bạn và gọi số **115** để được giúp đỡ nhé!'
    },
    {
        id: 'choking_first_aid',
        category: 'injury',
        badge: '',
        keywords: [
            'em bị hóc nghẹn thì sao',
            'em bi hoc nghen thi sao',
            'bị hóc nghẹn',
            'hóc xương',
            'hóc dị vật',
            'nghẹn thức ăn',
            'xử lý khi bị hóc',
            'hóc nghẹn làm gì',
            'sơ cứu hóc dị vật',
            'hóc nghẹn',
            'em bi hoc nghen'
        ],
        response: '**Nếu em hoặc bạn bị hóc nghẹn thức ăn hoặc dị vật:** 🍎⚠️\n\n1. **Nếu còn ho được:** Hãy khuyến khích ho thật mạnh liên tục để tống dị vật ra ngoài. Tuyệt đối không dùng tay móc họng bừa bãi vì có thể đẩy dị vật sâu hơn.\n2. **Hô to báo người lớn ngay lập tức!**\n3. **Người lớn sơ cứu:** Thực hiện vỗ lưng 5 cái giữa 2 xương bả vai, hoặc ép bụng (thủ thuật Heimlich) để đẩy dị vật ra ngoài.\n4. Nếu khó thở, tím tái: Gọi ngay **115** để đưa đi cấp cứu khẩn cấp!'
    },
    {
        id: 'strange_dog_safety',
        category: 'injury',
        badge: '',
        keywords: [
            'gặp chó lạ làm gì',
            'gap cho la lam gi',
            'chó lạ',
            'bị chó đuổi',
            'chó dữ',
            'gặp chó ngoài đường',
            'chó tấn công',
            'chó cắn làm sao',
            'gặp chó hung dữ',
            'gap cho la'
        ],
        response: '**Khi gặp chó lạ hoặc chó hung dữ, em hãy nhớ:** 🐶🛑\n\n• **Đứng yên như một cái cây:** Hai tay khép sát người, chân đứng thẳng, không cử động.\n• **Không nhìn thẳng vào mắt chó:** Vì chó sẽ tưởng em đang thách thức nó.\n• **Tuyệt đối không bỏ chạy hoặc la hét:** Chó có bản năng săn mồi, thấy chạy nó sẽ lao theo đuổi cắn.\n• Từ từ lùi lại phía sau thật chậm rãi khi chó đã quay đi.\n• **Nếu bị ngã:** Cuộn tròn người lại, hai tay ôm che kín đầu, tai và cổ.\n• **Nếu bị cắn:** Rửa vết thương bằng xà phòng dưới vòi nước 15 phút và bảo bố mẹ đưa đi tiêm phòng dại ngay!'
    },
    {
        id: 'fire_emergency_number_114',
        category: 'fire',
        badge: '',
        keywords: [
            'số cứu hỏa là gì',
            'so cuu hoa la gi',
            'số điện thoại cứu hỏa',
            'cháy gọi số mấy',
            'số 114',
            'gọi cứu hỏa',
            'số báo cháy',
            'cứu hỏa số mấy',
            'số điện thoại 114 là gì',
            'số 114 là gì'
        ],
        response: '**Số điện thoại cứu hỏa khẩn cấp là 114 em nhé!** 🚒🔥\n\n• Cuộc gọi đến **114 là hoàn toàn miễn phí** và có thể gọi được ngay cả khi điện thoại hết tiền.\n• **Khi gọi 114, em cần nói rõ:**\n  1. Địa chỉ chính xác nơi đang cháy (số nhà, đường, trường học...).\n  2. Cháy cái gì và có ai bị kẹt không.\n  3. Tên và số điện thoại của em.\n• Sau khi gọi, hãy nhanh chóng di chuyển ra nơi thoáng khí an toàn chờ các chú lính cứu hỏa đến nhé!'
    },
    {
        id: 'electrical_safety_dont_play',
        category: 'electric',
        badge: 'assets/illust_electric.png',
        keywords: [
            'không tự ý nghịch điện',
            'khong tu y nghich dien',
            'nghịch điện',
            'an toàn điện cho bé',
            'chơi với ổ điện',
            'cắm điện',
            'nguy hiểm từ điện',
            'chơi đồ điện',
            'khong nghich dien'
        ],
        response: '**Đúng rồi em nhé! Điện rất nguy hiểm, tuyệt đối không tự ý nghịch điện!** ⚡🔌\n\n**Những điều em cần ghi nhớ để an toàn:**\n• Không dùng que sắt, bút, thìa hay ngón tay chọc vào ổ cắm điện.\n• Không chạm vào công tắc, phích cắm khi **tay đang ướt** hoặc chân trần trên sàn ướt.\n• Không tự ý cắm hoặc rút phích cắm điện, hãy nhờ người lớn giúp.\n• Tránh xa các trạm biến áp, dây điện đứt rơi trên mặt đất (giữ khoảng cách ít nhất 10m).\n• Khi trời mưa dông sấm sét, không đứng dưới gốc cây to và hạn chế dùng thiết bị điện trong nhà!'
    },
    {
        id: 'burn_emergency_first_aid',
        category: 'injury',
        badge: '',
        keywords: [
            'bị bỏng nước sôi làm gì',
            'bi bong nuoc soi lam gi',
            'bi bong nuoc soi',
            'sơ cứu khi bị bỏng',
            'bị bỏng làm sao',
            'bỏng nước sôi',
            'bỏng bô xe máy',
            'bôi gì khi bị bỏng',
            'bị bỏng nước sôi'
        ],
        response: '**Khi bị bỏng nước sôi, bỏng lửa hoặc bô xe máy:** 🩹💧\n\n1. **Xả nước mát sạch:** Ngay lập tức ngâm hoặc xối nhẹ vùng bị bỏng dưới vòi nước mát sạch trong 15 - 20 phút để giảm nhiệt độ và bớt đau rát.\n2. **Tuyệt đối KHÔNG:** Không bôi kem đánh răng, mỡ trăn, nước mắm, xà phòng hay chườm đá lạnh trực tiếp vì sẽ làm vết thương nặng thêm.\n3. **Che vết bỏng:** Dùng gạc sạch hoặc khăn mềm che nhẹ vết thương.\n4. Báo ngay bố mẹ để đưa em đến cơ sở y tế gần nhất kiểm tra nhé!'
    },
    {
        id: 'helmet_safety',
        category: 'traffic',
        badge: '',
        keywords: [
            'đội mũ bảo hiểm đúng cách',
            'doi mu bao hiem dung cach',
            'đội mũ bảo hiểm',
            'tại sao phải đội mũ bảo hiểm',
            'đi xe máy đội mũ',
            'đội mũ an toàn',
            'quy tắc đội mũ bảo hiểm đúng cách'
        ],
        response: '**Đội mũ bảo hiểm là bắt buộc để bảo vệ vùng đầu của em khi ngồi trên xe máy, xe đạp điện!** 🪖🛵\n\n**3 Bước đội mũ bảo hiểm đúng cách:**\n1. Chọn mũ vừa vặn với kích cỡ đầu của em.\n2. Cài quai khóa chắc chắn dưới cằm.\n3. Quai mũ vừa khít (đút lọt 2 ngón tay), không đội mũ quá lỏng hoặc lật ra sau gáy.\n\n*Nhớ luôn nhắc bố mẹ và người thân cùng đội mũ bảo hiểm mỗi khi đi xe nhé!*'
    },
    {
        id: 'bee_sting_first_aid',
        category: 'injury',
        badge: '',
        keywords: [
            'bị ong đốt xử lý thế nào',
            'bi ong dot xu ly the nao',
            'bị ong đốt',
            'bi ong dot lam sao',
            'ong chích',
            'xử lý khi bị ong đốt',
            'sơ cứu ong đốt'
        ],
        response: '**Khi bị ong đốt, em hãy bình tĩnh xử lý như sau:** 🐝🩹\n\n1. Nhanh chóng rời khỏi nơi có ong để tránh bị đốt thêm.\n2. Nhờ người lớn dùng móng tay hoặc cạnh thẻ nhựa gạt nhẹ ngòi ong ra (không bóp mạnh vào vết đốt).\n3. Rửa sạch bằng xà phòng và nước sạch, sau đó chườm khăn mát.\n4. Báo ngay người lớn nếu cảm thấy khó thở, chóng mặt hoặc sưng phù to để đi bệnh viện cấp cứu kịp thời!'
    },
    {
        id: 'yellow_traffic_light_rule',
        category: 'traffic',
        badge: 'assets/illust_traffic.png',
        keywords: [
            'đèn giao thông màu vàng phải làm sao',
            'den giao thong mau vang phai lam sao',
            'đèn vàng làm gì',
            'ý nghĩa đèn vàng',
            'gặp đèn vàng',
            'tín hiệu đèn vàng giao thông',
            'đèn vàng giao thông'
        ],
        response: '**Khi gặp đèn tín hiệu giao thông màu vàng, em cần nhớ:** 🟡🚦\n\n• **Quy tắc chuẩn:** Phải dừng lại trước vạch dừng xe.\n• **Trường hợp đã vượt quá vạch dừng:** Nếu xe đã đi quá vạch dừng mà dừng lại sẽ gây nguy hiểm cho xe phía sau thì được phép tiếp tục đi tiếp.\n• **Đèn vàng nhấp nháy:** Báo hiệu được đi nhưng phải giảm tốc độ, chú ý quan sát và nhường đường cho người đi bộ!'
    },
    {
        id: 'walking_on_road_without_sidewalk',
        category: 'traffic',
        badge: 'assets/illust_traffic.png',
        keywords: [
            'đi bộ trên đường không có vỉa hè',
            'di bo tren duong khong co via he',
            'đường không có vỉa hè đi thế nào',
            'đi bộ dưới lòng đường',
            'quy tắc đi bộ an toàn',
            'không có vỉa hè'
        ],
        response: '**Khi đi bộ trên đoạn đường không có vỉa hè, em hãy nhớ quy tắc sống còn sau:** 🚶‍♂️⚠️\n\n• **Đi sát vào mép đường bên tay phải** theo chiều đi của mình.\n• **Luôn chú ý quan sát xe cộ:** Nhìn trước ngó sau, không đùa nghịch, chạy nhảy hoặc xô đẩy bạn bè.\n• **Không đeo tai nghe hoặc bấm điện thoại:** Để có thể nghe rõ tiếng còi xe từ xa.\n• **Mặc quần áo sáng màu:** Nếu đi vào lúc trời nhá nhem tối để tài xế từ xa dễ dàng nhìn thấy em!'
    },
    {
        id: 'bicycle_safety_on_road',
        category: 'traffic',
        badge: 'assets/illust_traffic.png',
        keywords: [
            'đi xe đạp trên đường cần nhớ gì',
            'di xe dap tren duong can nho gi',
            'đi xe đạp an toàn',
            'quy tắc đi xe đạp',
            'học sinh đi xe đạp',
            'lưu ý khi đi xe đạp'
        ],
        response: '**Khi đi xe đạp trên đường, các bạn học sinh cần ghi nhớ:** 🚲🚦\n\n1. **Kiểm tra xe trước khi đi:** Phanh (thắng), lốp xe và chuông xe phải hoạt động tốt.\n2. **Đi đúng phần đường:** Đi sát lề đường bên phải, không đi vào làn đường dành cho xe máy, ô tô.\n3. **Tuyệt đối KHÔNG:** Không buông cả hai tay, không lạng lách, không dàn hàng 3 hàng 4, không bám kéo xe khác.\n4. **Khi muốn rẽ:** Giảm tốc độ, giơ tay xin đường và quan sát kỹ trước sau!'
    },
    {
        id: 'fire_escape_crawl_low',
        category: 'fire',
        badge: 'assets/illust_electric.png',
        keywords: [
            'cách bò thấp thoát khỏi đám khói',
            'cach bo thap thoat khoi dam khoi',
            'bò thấp khi có cháy',
            'tại sao phải bò thấp',
            'thoát khỏi khói độc',
            'bò men theo tường',
            'bò thấp'
        ],
        response: '**Tại sao phải bò thấp khi thoát khỏi đám khói cháy?** 🧯🏃‍♂️\n\n• **Lý do:** Khói độc và hơi nóng nhẹ hơn không khí nên sẽ bốc ngược lên trần nhà. Lớp không khí mát và sạch nhất luôn nằm sát mặt sàn (cách sàn 20 - 30cm).\n• **Cách thực hiện:**\n  1. Cúi gập người hoặc bò bằng hai bàn tay và hai đầu gối sát sàn nhà.\n  2. Một tay men theo chân tường để định hướng lối thoát hiểm ra cửa.\n  3. Đầu cúi thấp, miệng và mũi luôn được che chắn bằng khăn ướt!'
    },
    {
        id: 'fire_escape_wet_towel',
        category: 'fire',
        badge: 'assets/illust_electric.png',
        keywords: [
            'dùng khăn ướt bịt mũi miệng khi cháy',
            'dung khan uot bit mui mieng khi chay',
            'khăn ướt khi có cháy',
            'tại sao dùng khăn ướt',
            'bịt khăn ướt lọc khói',
            'khăn ướt lọc khói'
        ],
        response: '**Tác dụng tuyệt vời của chiếc khăn ướt khi có hỏa hoạn:** 💧🧯\n\n• **Lọc khí độc:** Nước trong khăn ướt hấp thụ khí độc (như CO, CO2, bụi than mịn) và làm nguội luồng khí nóng trước khi hít vào phổi.\n• **Cách dùng:**\n  1. Nhúng đẫm khăn mặt, khẩu trang hoặc vạt áo vào nước sạch.\n  2. Gấp lại 3 - 4 lớp rồi áp chặt che kín mũi và miệng.\n  3. Thở chậm rãi, đều đặn qua khăn trong lúc bò thấp thoát ra ngoài an toàn!'
    },
    {
        id: 'fire_escape_high_rise_building',
        category: 'fire',
        badge: 'assets/illust_electric.png',
        keywords: [
            'thoát hiểm nhà cao tầng khi có cháy',
            'thoat hiem nha cao tang khi co chay',
            'cháy chung cư làm gì',
            'thoát hiểm chung cư',
            'cháy ở nhà cao tầng'
        ],
        response: '**Kỹ năng thoát hiểm sinh tử khi có cháy ở nhà cao tầng, chung cư:** 🏢🚨\n\n1. **TUYỆT ĐỐI KHÔNG DÙNG THANG MÁY:** Khi cháy, nguồn điện thường bị ngắt hoặc chập, em sẽ bị kẹt chết ngạt trong thang máy. Hãy luôn dùng **thang bộ thoát hiểm**.\n2. **Kiểm tra nhiệt độ tay nắm cửa:** Chạm mu bàn tay vào tay nắm cửa, nếu thấy nóng ran thì tuyệt đối không mở vì bên ngoài lửa đang cháy to.\n3. **Nếu bị kẹt trong phòng:** Dùng chăn/khăn ướt chèn kín khe cửa, ra ban công vẫy khăn sáng màu ra hiệu kêu cứu và gọi ngay **114**!'
    },
    {
        id: 'sharp_objects_safety',
        category: 'injury',
        badge: '',
        keywords: [
            'cẩn thận với dao kéo và vật sắc nhọn',
            'can than voi dao keo va vat sac nhon',
            'dao kéo vật sắc nhọn',
            'an toàn với dao kéo',
            'vật sắc nhọn',
            'bị đứt tay'
        ],
        response: '**Quy tắc an toàn với dao kéo và các vật sắc nhọn:** ✂️🔪\n\n• **Không đùa nghịch:** Tuyệt đối không cầm dao, kéo, compa, que nhọn chạy nhảy hoặc đùa giỡn.\n• **Cách đưa kéo an toàn:** Luôn nắm phần lưỡi kéo (đã khép chặt) trong lòng bàn tay và đưa phần cán cầm cho người khác.\n• **Nếu bị đứt tay chảy máu:** Rửa sạch vết thương dưới vòi nước, dùng gạc hoặc khăn sạch ấn chặt vào vết thương 5 - 10 phút để cầm máu, rồi báo người lớn băng bó!'
    },
    {
        id: 'child_protection_helpline_111',
        category: 'quick',
        badge: '',
        keywords: [
            'gọi 111 bảo vệ trẻ em khi nào',
            'goi 111 bao ve tre em khi nao',
            'số điện thoại 111 là gì',
            'số 111 là gì',
            'tổng đài 111',
            'khi nào gọi 111',
            'tổng đài quốc gia bảo vệ trẻ em'
        ],
        response: '**Tổng đài Quốc gia Bảo vệ Trẻ em 111:** 📞🛡️\n\n• **Đây là đường dây nóng miễn phí 24/7** của Nhà nước dành riêng để bảo vệ các bạn nhỏ trên toàn quốc.\n• **Em hãy gọi 111 khi:**\n  1. Bản thân em hoặc bạn bè bị bạo lực, đánh đập, bóc lột.\n  2. Bị người khác đụng chạm vào vùng kín, quấy rối hoặc xâm hại.\n  3. Bị bắt nạt học đường hoặc gặp hoàn cảnh nguy hiểm cần tư vấn tâm lý, pháp lý.\n• Các cô chú ở tổng đài 111 luôn lắng nghe, bảo mật và can thiệp bảo vệ em kịp thời!'
    },
    {
        id: 'police_helpline_113',
        category: 'quick',
        badge: '',
        keywords: [
            'số điện thoại 113 là gì',
            'số 113 là gì',
            'gọi 113 khi nào',
            'tổng đài 113',
            'số cảnh sát 113'
        ],
        response: '**Số điện thoại khẩn cấp 113 là số của Cảnh sát phản ứng nhanh:** 👮🚨\n\n• Gọi miễn phí 24/7 khi gặp: Tội phạm trộm cướp, đánh nhau, gây rối trật tự an ninh, hoặc khi phát hiện các hành vi vi phạm pháp luật nguy hiểm cần can thiệp khẩn cấp.'
    },
    {
        id: 'medical_helpline_115',
        category: 'quick',
        badge: '',
        keywords: [
            'số điện thoại 115 là gì',
            'số 115 là gì',
            'gọi 115 khi nào',
            'tổng đài 115',
            'số cấp cứu 115'
        ],
        response: '**Số điện thoại khẩn cấp 115 là tổng đài Cấp cứu Y tế:** 🚑🚨\n\n• Gọi miễn phí 24/7 khi có người bị tai nạn thương tích nặng, đuối nước, bất tỉnh, ngộ độc, khó thở hoặc nguy kịch tính mạng cần xe cứu thương đến cấp cứu khẩn cấp.'
    },
    {
        id: 'wet_hands_touch_socket_danger',
        category: 'electric',
        badge: 'assets/illust_electric.png',
        keywords: [
            'tay ướt có được chạm vào ổ cắm không',
            'tay uot co duoc cham vao o cam khong',
            'tay ướt cắm điện',
            'chạm vào ổ điện khi tay ướt',
            'tại sao tay ướt không được chạm vào điện',
            'tay ướt chạm vào điện'
        ],
        response: '**Tuyệt đối KHÔNG được chạm vào ổ cắm, công tắc hay thiết bị điện khi tay đang ướt!** ⚡💧\n\n• Nước là chất dẫn điện cực mạnh. Khi tay bị ướt, điện trở của da người giảm đi hàng trăm lần, dòng điện sẽ dễ dàng phóng qua cơ thể gây giật điện tử vong ngay lập tức!\n• **Em cần nhớ:** Luôn lau thật khô tay bằng khăn sạch trước khi chạm vào bất kỳ thiết bị điện nào nhé!'
    },
    {
        id: 'fallen_power_line_safety',
        category: 'electric',
        badge: 'assets/illust_electric.png',
        keywords: [
            'thấy dây điện rơi xuống đất làm gì',
            'thay day dien roi xuong dat lam gi',
            'dây điện đứt rơi xuống',
            'dây điện rơi xuống đất',
            'gặp dây điện đứt'
        ],
        response: '**Khi thấy dây điện bị đứt rơi xuống đất hoặc vỉa hè:** ⚡⚠️\n\n1. **Tránh xa ngay lập tức:** Giữ khoảng cách an toàn **ít nhất 10 mét** tính từ vị trí sợi dây điện rơi.\n2. **Tuyệt đối không chạm vào:** Không dùng que gậy chọc vào dây điện hay các vũng nước gần đó.\n3. **Cảnh báo mọi người xung quanh:** Hô to để người khác không bước vào vùng nguy hiểm.\n4. **Báo ngay cho người lớn** hoặc gọi điện báo cơ quan điện lực để cắt điện khẩn cấp!'
    },
    {
        id: 'lightning_thunderstorm_safety',
        category: 'electric',
        badge: '',
        keywords: [
            'tránh sét đánh khi trời mưa dông',
            'tranh set danh khi troi mua dong',
            'tránh sét',
            'sét đánh trú ẩn ở đâu',
            'trời mưa sấm sét làm gì'
        ],
        response: '**Quy tắc vàng phòng tránh sét đánh khi trời mưa dông, sấm sét:** ⛈️⚡\n\n• **Nhanh chóng vào trong nhà kiên cố:** Đóng kín cửa sổ và cửa ra vào.\n• **TUYỆT ĐỐI KHÔNG:**\n  ❌ Không trú mưa dưới gốc cây to hoặc cột điện ngoài trời.\n  ❌ Không ở gần các vật kim loại (xe đạp, hàng rào sắt).\n  ❌ Không tắm ao, hồ, sông, bể bơi khi trời đang sấm sét.\n  ❌ Hạn chế dùng các thiết bị điện đang cắm sạc.\n• **Nếu đang ở giữa đồng trống:** Ngồi xổm thấp người, chụm hai chân lại, gục đầu vào đầu gối, không nằm áp sát xuống mặt đất!'
    },
    {
        id: 'frayed_wire_safety',
        category: 'electric',
        badge: 'assets/illust_electric.png',
        keywords: [
            'dây điện bị hở phải làm sao',
            'day dien bi ho phai lam sao',
            'dây điện hở',
            'phát hiện dây điện bị hở',
            'dây điện rách vỏ'
        ],
        response: '**Khi phát hiện dây điện bị hở hoặc rách vỏ cách điện:** 🔌⚡\n\n1. **Tuyệt đối không chạm tay vào:** Kể cả khi chưa thấy phát ra tia lửa điện.\n2. **Báo ngay cho bố mẹ hoặc người lớn trong nhà:** Để người lớn ngắt nguồn điện và dùng băng dính cách điện chuyên dụng quấn chặt lại hoặc thay dây mới.\n3. Nhắc nhở các bạn nhỏ khác trong nhà không được đến gần khu vực dây điện hở đó!'
    },
    {
        id: 'emergency_numbers_list',
        category: 'quick',
        badge: '',
        keywords: [
            'các số điện thoại khẩn cấp',
            'cac so dien thoai khan cap',
            'số điện thoại khẩn cấp',
            'bốn số điện thoại cứu hộ khẩn cấp',
            'số cứu hộ'
        ],
        response: '**Bốn số điện thoại cứu hộ khẩn cấp quan trọng nhất mà em cần thuộc lòng:** 📞🚨\n\n• **111 - Tổng đài Quốc gia Bảo vệ Trẻ em** (Miễn phí 24/7): Gọi khi bị bạo lực, xâm hại hoặc cần hỗ trợ bảo vệ trẻ em.\n• **113 - Cảnh sát phản ứng nhanh**: Gọi khi gặp tội phạm, trộm cướp, mất trật tự an ninh.\n• **114 - Cứu hỏa và cứu nạn**: Gọi khi có hỏa hoạn, cháy nổ, sập đổ công trình.\n• **115 - Cấp cứu y tế**: Gọi khi có người bị thương tích nặng, đuối nước, bất tỉnh.\n\n*(Tất cả 4 số này đều miễn phí cước gọi và trực 24/24 giờ!)*'
    }
];

newItems.forEach(newItem => {
    let existing = kb.find(x => x.id === newItem.id);
    if (!existing) {
        kb.unshift(newItem); // Priority for new curated items
    } else {
        newItem.keywords.forEach(kw => {
            if (!existing.keywords.includes(kw)) existing.keywords.push(kw);
        });
        existing.response = newItem.response;
        if (newItem.badge) existing.badge = newItem.badge;
    }
});

// Also assign badges to known visual items
kb.forEach(item => {
    if (!item.badge) {
        if (item.id === 'see_friend_falling_water_screenshot' || item.id === 'see_drowning_person_general' || item.id === 'cramp_swimming_what_to_do') {
            item.badge = 'assets/illust_drowning.png';
        } else if (item.id === 'electrical_fire_water_forbidden' || item.id === 'electrical_safety_dont_play' || item.id === 'wet_hands_touch_socket_danger') {
            item.badge = 'assets/illust_electric.png';
        } else if (item.id === 'pedestrian_crosswalk_safety' || item.id === 'yellow_traffic_light_rule' || item.id === 'bicycle_safety_on_road') {
            item.badge = 'assets/illust_traffic.png';
        }
    }
});

console.log('Final KB items count:', kb.length);

const output = `// DỮ LIỆU TRI THỨC VÀ BỘ MÁY TÌM KIẾM CỦA CHATBOT ENDY
// Lá chắn an toàn của các bạn nhỏ - Tổng cộng ${kb.length} tình huống & kiến thức an toàn

window.ENDY_KB = ${JSON.stringify(kb, null, 2)};

// Chuẩn hóa tiếng Việt không dấu
function removeVietnameseTones(str) {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/[\\u0300-\\u036f]/g, '');
    return str.trim();
}

// Danh sách từ dừng tiếng Việt thông dụng (không dùng để tính điểm trùng lặp đơn từ)
const STOP_WORDS = new Set([
    'là', 'gì', 'thế', 'nào', 'làm', 'sao', 'có', 'không', 'được', 'khi', 'vào', 
    'cho', 'em', 'bạn', 'và', 'của', 'ở', 'đang', 'phải', 'với', 'nhé', 'đi', 'thì',
    'la', 'gi', 'the', 'nao', 'lam', 'sao', 'co', 'khong', 'duoc', 'khi', 'vao',
    'cho', 'em', 'ban', 'va', 'cua', 'o', 'dang', 'phai', 'voi', 'nhe', 'di', 'thi'
]);

// BỘ MÁY TÌM KIẾM THÔNG MINH ENDY
window.searchEndyKB = function(userQuery) {
    if (!userQuery || typeof userQuery !== 'string') return null;
    let query = userQuery.toLowerCase().trim();
    // Bỏ dấu hỏi chấm, chấm than ở cuối câu
    query = query.replace(/[?!.,]+$/g, '').trim();

    const queryNoTone = removeVietnameseTones(query);
    const userWords = query.split(/\\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
    const userWordsNoTone = queryNoTone.split(/\\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));

    // Chào hỏi
    if (['chào', 'xin chào', 'hi', 'hello', 'alo', 'bắt đầu', 'chào bạn', 'chào endy'].includes(query) ||
        ['chao', 'xin chao', 'chao ban', 'chao endy'].includes(queryNoTone)) {
        const greetItem = window.ENDY_KB.find(x => x.id === 'greeting');
        if (greetItem) return { item: greetItem, score: 1000 };
    }

    let bestMatch = null;
    let highestScore = 0;

    for (let i = 0; i < window.ENDY_KB.length; i++) {
        const item = window.ENDY_KB[i];
        let score = 0;

        for (let j = 0; j < item.keywords.length; j++) {
            let kw = item.keywords[j].toLowerCase().trim();
            kw = kw.replace(/[?!.,]+$/g, '').trim();
            const kwNoTone = removeVietnameseTones(kw);

            // 1. Khớp chính xác tuyệt đối cụm từ (ƯU TIÊN TUYỆT ĐỐI CAO NHẤT)
            if (query === kw || queryNoTone === kwNoTone) {
                score += 1000;
                break;
            }

            // 2. Query chứa nguyên cụm từ khóa hoặc ngược lại
            if (query.includes(kw) || kw.includes(query)) {
                score += 150;
            } else if (queryNoTone.includes(kwNoTone) || kwNoTone.includes(queryNoTone)) {
                score += 100;
            }

            // 3. Khớp từ có nghĩa (đã loại bỏ stop words)
            let wordMatch = 0;
            for (let w = 0; w < userWords.length; w++) {
                if (kw.includes(userWords[w])) wordMatch++;
            }
            if (wordMatch > 0) score += wordMatch * 25;

            // 4. Khớp từ không dấu có nghĩa
            let wordNoToneMatch = 0;
            for (let w = 0; w < userWordsNoTone.length; w++) {
                if (kwNoTone.includes(userWordsNoTone[w])) wordNoToneMatch++;
            }
            if (wordNoToneMatch > 0) score += wordNoToneMatch * 15;
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = item;
        }
    }

    if (bestMatch && highestScore >= 35) {
        return { item: bestMatch, score: highestScore };
    }

    return null;
};
`;

fs.writeFileSync('chatbot-data.js', output, 'utf8');
console.log('Saved updated chatbot-data.js successfully!');
