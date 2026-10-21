(function() {
    // Ngăn chặn khởi tạo trùng lặp
    if (window.__endyChatbotLoaded) return;
    window.__endyChatbotLoaded = true;

    const ASSISTANT_NAME = "Endy - Lá chắn an toàn của các bạn nhỏ 🛡️";

    // Âm thanh thông báo "Ting Teng" nhẹ nhàng bằng Web Audio API
    function playTingSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc2.type = 'sine';

            // Nốt E6 & B6 tạo tiếng Teng nhẹ nhàng, hiện đại
            osc1.frequency.setValueAtTime(1318.51, ctx.currentTime); 
            osc2.frequency.setValueAtTime(1975.53, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 0.25);
            osc2.start(ctx.currentTime + 0.08);
            osc2.stop(ctx.currentTime + 0.45);
        } catch (e) {}
    }

    // CƠ SỞ DỮ LIỆU TRI THỨC (KB) - LUẬT 2025, TÀI LIỆU TUYÊN TRUYỀN & TÌNH HUỐNG
    const KB = [
        {
        id: "greeting",
        keywords: [
            'chào',
            'xin chào',
            'hi',
            'hello',
            'alo',
            'bắt đầu',
            'bat dau',
            'chào bạn',
            'chào bot',
            'có ai không',
            'trợ lý'
        ],
        response: "**Chào em! 👋 Mình là Endy - Lá chắn an toàn của các bạn nhỏ 🛡️**\n\n" +
                  "Mình sẽ đồng hành cùng em tìm hiểu về **phòng, chống tai nạn thương tích và đuối nước**.\n\n" +
                  "Em có thể hỏi mình về an toàn khi bơi, phòng tránh đuối nước, té ngã, bỏng, điện giật, tai nạn giao thông, vật sắc nhọn, động vật cắn và nhiều tình huống nguy hiểm khác trong cuộc sống.\n\n" +
                  "Em muốn Endy giúp gì nào? 😊"
    },

    {
        id: "bot_identity",
        keywords: [
            'bạn là ai',
            'ban la ai',
            'ai vậy',
            'ai đấy',
            'trợ lý là ai',
            'bot là ai',
            'bạn làm gì'
        ],
        response: "**Mình là Endy 🛡️ - Lá chắn an toàn của các bạn nhỏ.**\n\n" +
                  "Mình là trợ lý AI giúp các em học sinh tìm hiểu kiến thức và kỹ năng **phòng, chống tai nạn thương tích và đuối nước**.\n\n" +
                  "Endy sẽ giúp em biết cách **nhận diện nguy hiểm - phòng tránh - xử lý đúng khi có tình huống xảy ra**."
    },

    {
        id: "bot_name",
        keywords: [
            'bạn tên gì',
            'ban ten gi',
            'tên bạn là gì',
            'tên chatbot',
            'chatbot tên gì',
            'tên của bạn',
            'huno là ai'
        ],
        response: "**Mình tên là Endy 🛡️**\n\n" +
                  "Tên đầy đủ của mình là **Endy - Lá chắn an toàn của các bạn nhỏ**.\n\n" +
                  "Mình sẽ cùng em học cách nhận biết nguy hiểm, phòng tránh tai nạn và bảo vệ bản thân an toàn hơn mỗi ngày. 😊"
    },

    {
        id: "bot_can_help",
        keywords: [
            'bạn biết gì',
            'ban biet gi',
            'bạn làm được gì',
            'giúp gì',
            'giup gi',
            'hỏi gì được',
            'có thể hỏi gì',
            'huno giúp gì',
            'huno biết gì'
        ],
        response: "**Endy có thể giúp em tìm hiểu rất nhiều kiến thức về an toàn. 🛡️**\n\n" +
                  "Ví dụ như:\n" +
                  "• Phòng tránh đuối nước và bơi an toàn.\n" +
                  "• Phòng tránh té ngã, bỏng và điện giật.\n" +
                  "• An toàn khi tham gia giao thông.\n" +
                  "• Phòng tránh tai nạn khi vui chơi, học tập và sinh hoạt.\n" +
                  "• Cách xử lý khi gặp vật sắc nhọn, động vật cắn hoặc tình huống nguy hiểm.\n" +
                  "• Cách gọi người lớn và tìm sự trợ giúp khi xảy ra tai nạn.\n\n" +
                  "Em cứ hỏi Huno bằng cách nói bình thường nhé! 😊"
    },

    {
        id: "ask_to_start",
        keywords: [
            'bắt đầu thôi',
            'bat dau thoi',
            'bắt đầu học',
            'học thôi',
            'hoc thoi',
            'mình bắt đầu nhé',
            'sẵn sàng',
            'san sang'
        ],
        response: "**Được rồi, chúng mình bắt đầu nhé! 🛡️**\n\n" +
                  "Em có thể hỏi Huno bất cứ điều gì về **phòng chống đuối nước, tai nạn thương tích và kỹ năng an toàn**.\n\n" +
                  "Ví dụ: **“Đuối nước là gì?”**, **“Bị bỏng phải làm sao?”**, **“Bạn bị ngã thì em nên làm gì?”** hoặc **“Em bị rơi xuống nước phải xử lý thế nào?”**"
    },

    {
        id: "thanks",
        keywords: [
            'cảm ơn',
            'cam on',
            'cám ơn',
            'thanks',
            'thank you',
            'cảm ơn bạn',
            'cảm ơn huno'
        ],
        response: "**Không có gì đâu! 😊**\n\n" +
                  "Endy rất vui khi được giúp em.\n\n" +
                  "Hãy luôn nhớ: **Nhận biết nguy hiểm - Phòng tránh từ sớm - Gọi người lớn khi cần giúp đỡ. 🛡️**\n\n" +
                  "Em còn muốn hỏi Huno điều gì nữa không?"
    },

    {
        id: "goodbye",
        keywords: [
            'tạm biệt',
            'tam biet',
            'bye',
            'goodbye',
            'hẹn gặp lại',
            'hen gap lai',
            'mình đi đây',
            'thoát'
        ],
        response: "**Tạm biệt em! 👋**\n\n" +
                  "Endy chúc em luôn vui khỏe và an toàn. 🛡️\n\n" +
                  "Nhớ nhé: **Cẩn thận khi vui chơi - Không chủ quan trước nguy hiểm - Gặp sự cố hãy gọi người lớn.**\n\n" +
                  "Hẹn gặp lại em!"
    },
        
        {
        id: "drowning_definition",
        keywords: [
            'đuối nước là gì',
            'thế nào là đuối nước',
            'duoi nuoc la gi',
            'bị đuối nước là sao',
            'đuối nước nghĩa là gì'
        ],
        response: "**Đuối nước là gì?**\n\n" +
                  "Đuối nước xảy ra khi một người bị chìm hoặc ngập trong nước làm cho đường thở bị ảnh hưởng và cơ thể không nhận đủ ôxy.\n\n" +
                  "Đuối nước có thể xảy ra ở ao, hồ, sông, suối, biển, bể bơi và cả những vật chứa nước trong gia đình. Đuối nước rất nguy hiểm vì có thể gây tổn thương nghiêm trọng cho cơ thể, thậm chí dẫn đến tử vong.\n\n" +
                  "Vì vậy, khi ở gần nước, em cần luôn cẩn thận, nghe lời người lớn và tuân thủ các quy tắc an toàn."
    },

    {
        id: "drowning_can_happen_anywhere",
        keywords: [
            'đuối nước xảy ra ở đâu',
            'ở đâu có thể bị đuối nước',
            'duoi nuoc xay ra o dau',
            'những nơi nào có thể gây đuối nước'
        ],
        response: "**Đuối nước có thể xảy ra ở rất nhiều nơi.**\n\n" +
                  "Không chỉ sông, hồ hoặc biển mới nguy hiểm. Đuối nước còn có thể xảy ra ở ao, suối, kênh, mương, bể bơi, giếng, hố nước, bể chứa nước, chum, vại hoặc những vật dụng có chứa nước.\n\n" +
                  "Điều quan trọng là em không được nghĩ rằng một nơi có ít nước thì chắc chắn an toàn. Với trẻ nhỏ, chỉ một lượng nước không nhiều cũng có thể gây nguy hiểm.\n\n" +
                  "Hãy tránh xa những nơi có nước nếu không có người lớn đi cùng."
    },

    {
        id: "dangerous_water_places",
        keywords: [
            'những nơi nào nguy hiểm gần nước',
            'nơi nào dễ bị đuối nước',
            'noi nao de bi duoi nuoc',
            'khu vực nước nào nguy hiểm',
            'chỗ nào dễ xảy ra đuối nước'
        ],
        response: "**Một số nơi có nguy cơ gây đuối nước cao gồm:**\n\n" +
                  "1. Ao, hồ, sông, suối, kênh, mương.\n" +
                  "2. Giếng, bể chứa nước, hố sâu có nước.\n" +
                  "3. Bể bơi không có người giám sát.\n" +
                  "4. Biển, đặc biệt ở nơi có sóng lớn hoặc dòng nước mạnh.\n" +
                  "5. Các hố công trình, hố lấy đất, hố lấy cát hoặc cống thoát nước bị ngập.\n\n" +
                  "Nhiều nơi nhìn bên ngoài có vẻ bình thường nhưng có thể rất sâu hoặc có dòng nước nguy hiểm. Vì vậy em không nên tự ý đến gần hoặc xuống nước."
    },

    {
        id: "pond_river_risk",
        keywords: [
            'ao hồ có nguy hiểm không',
            'sông suối có nguy hiểm không',
            'ao ho co nguy hiem khong',
            'tắm sông có nguy hiểm không',
            'tắm hồ có nguy hiểm không'
        ],
        response: "**Ao, hồ, sông và suối có thể rất nguy hiểm đối với trẻ em.**\n\n" +
                  "Những nơi này thường có độ sâu không đều, đáy trơn, bùn lầy, dòng chảy mạnh hoặc những vật mà chúng ta không nhìn thấy ở dưới nước.\n\n" +
                  "Đặc biệt, ở nhiều nơi không có biển cảnh báo hoặc hàng rào chắn nên trẻ em rất dễ trượt chân hoặc rơi xuống nước khi chơi gần đó.\n\n" +
                  "Em không được tự ý xuống ao, hồ, sông, suối để tắm hoặc chơi, kể cả khi em đã biết bơi."
    },

    {
        id: "well_risk",
        keywords: [
            'giếng có nguy hiểm không',
            'giếng nước có gây đuối nước không',
            'gieng co nguy hiem khong',
            'chơi gần giếng có sao không'
        ],
        response: "**Giếng nước là nơi rất nguy hiểm nếu không được che chắn cẩn thận.**\n\n" +
                  "Nếu giếng không có nắp đậy chắc chắn hoặc thành giếng thấp, trẻ em có thể bị trượt chân và rơi xuống.\n\n" +
                  "Vì vậy, giếng cần có nắp đậy an toàn và người lớn phải kiểm tra thường xuyên. Em không nên chơi đùa, chạy nhảy hoặc đứng sát miệng giếng."
    },

    {
        id: "water_container_risk",
        keywords: [
            'xô nước có nguy hiểm không',
            'chậu nước có nguy hiểm không',
            'chum nước có gây đuối nước không',
            'xo nuoc co nguy hiem khong',
            'ít nước có bị đuối nước không'
        ],
        response: "**Có. Những vật chứa ít nước vẫn có thể gây nguy hiểm.**\n\n" +
                  "Xô, chậu, chum, vại, bể nước hoặc các dụng cụ chứa nước trong gia đình đều có thể gây đuối nước, đặc biệt với trẻ nhỏ.\n\n" +
                  "Khi không sử dụng, người lớn nên đổ hết nước, đậy nắp hoặc đặt các vật chứa nước ở nơi trẻ em không thể tự tiếp cận.\n\n" +
                  "Em cũng không nên nghịch nước hoặc cúi đầu vào các vật chứa nước."
    },

    {
        id: "swimming_pool_risk",
        keywords: [
            'bể bơi có nguy hiểm không',
            'hồ bơi có an toàn không',
            'be boi co nguy hiem khong',
            'bể bơi có bị đuối nước không'
        ],
        response: "**Bể bơi thường an toàn hơn ao, hồ hoặc sông, nhưng vẫn có thể xảy ra đuối nước.**\n\n" +
                  "Nguy hiểm có thể xảy ra khi bể đông người, trẻ em tự ý xuống nước, chạy nhảy quanh thành bể, bơi quá sức hoặc không có người lớn và nhân viên cứu hộ giám sát.\n\n" +
                  "Khi đi bơi, em cần tuân theo hướng dẫn của giáo viên, người lớn hoặc nhân viên cứu hộ và tuyệt đối không tự ý xuống bể."
    },

    {
        id: "sea_risk",
        keywords: [
            'biển có nguy hiểm không',
            'tắm biển có nguy hiểm không',
            'bien co nguy hiem khong',
            'tắm biển có bị đuối nước không'
        ],
        response: "**Biển có nhiều nguy cơ mà trẻ em cần đặc biệt chú ý.**\n\n" +
                  "Biển có sóng, thủy triều và các dòng nước mạnh. Có những khu vực nhìn rất yên nhưng lại có dòng nước kéo người ra xa bờ.\n\n" +
                  "Khi đi biển, em chỉ nên tắm ở khu vực được phép, có người lớn đi cùng và có nhân viên cứu hộ. Không tự ý bơi ra xa bờ và không xuống nước khi sóng lớn hoặc thời tiết xấu."
    },

    {
        id: "flood_water_risk",
        keywords: [
            'nước lũ có nguy hiểm không',
            'nước ngập có nguy hiểm không',
            'nuoc lu co nguy hiem khong',
            'đi qua nước lũ có sao không'
        ],
        response: "**Nước lũ và nước ngập rất nguy hiểm.**\n\n" +
                  "Nước lũ có thể chảy rất mạnh, che khuất hố sâu, cống, vật sắc nhọn hoặc dây điện. Dòng nước mạnh còn có thể cuốn người đi rất nhanh.\n\n" +
                  "Vì vậy, em không được tự ý đi qua vùng nước lũ hoặc nước ngập. Nếu gặp nước lũ trên đường, hãy tìm nơi an toàn và nhờ người lớn giúp đỡ."
    },

    {
        id: "construction_water_hole",
        keywords: [
            'hố nước có nguy hiểm không',
            'hố công trình có nguy hiểm không',
            'ho nuoc co nguy hiem khong',
            'hố đào có nước có được chơi không'
        ],
        response: "**Hố công trình hoặc hố chứa nước có thể rất nguy hiểm.**\n\n" +
                  "Những hố này có thể rất sâu, bờ đất dễ trơn hoặc sạt xuống. Nhiều nơi còn không có hàng rào hoặc biển cảnh báo.\n\n" +
                  "Em không nên đứng gần mép hố, chơi đùa hoặc xuống lấy đồ vật bị rơi vào đó. Nếu thấy một khu vực nguy hiểm chưa được che chắn, hãy báo cho người lớn."
    },

    {
        id: "quiet_water_not_safe",
        keywords: [
            'nước yên có an toàn không',
            'chỗ nước lặng có an toàn không',
            'nuoc yen co an toan khong',
            'nước không có sóng có nguy hiểm không'
        ],
        response: "**Nước nhìn yên không có nghĩa là an toàn.**\n\n" +
                  "Dưới mặt nước có thể có chỗ rất sâu, dòng chảy mạnh, bùn lầy, vật sắc nhọn hoặc những nguy hiểm mà mắt thường không nhìn thấy được.\n\n" +
                  "Đặc biệt ở biển, một số vùng nước lặng còn có thể là nơi xuất hiện dòng chảy kéo người ra xa bờ.\n\n" +
                  "Vì vậy, em không nên tự đánh giá một nơi là an toàn chỉ vì thấy mặt nước yên."
    },

    {
        id: "drowning_is_silent",
        keywords: [
            'đuối nước có kêu cứu được không',
            'người đuối nước có la hét không',
            'duoi nuoc co keu cuu duoc khong',
            'đuối nước có xảy ra nhanh không'
        ],
        response: "**Đuối nước có thể xảy ra rất nhanh và đôi khi rất âm thầm.**\n\n" +
                  "Người gặp nạn dưới nước có thể không đủ sức để kêu cứu lớn hoặc vẫy tay như chúng ta thường nghĩ.\n\n" +
                  "Vì vậy, trẻ em cần luôn có người lớn giám sát khi ở gần nước. Nếu em thấy một bạn có biểu hiện bất thường dưới nước, hãy gọi người lớn hoặc nhân viên cứu hộ ngay."
    },
       
        {
        id: "drowning_causes_general",
        keywords: [
            'nguyên nhân gây đuối nước',
            'tại sao trẻ em bị đuối nước',
            'tai sao bi duoi nuoc',
            'vì sao xảy ra đuối nước',
            'những nguyên nhân nào gây đuối nước'
        ],
        response: "**Vì sao trẻ em có thể bị đuối nước?**\n\n" +
                  "Đuối nước có thể xảy ra do nhiều nguyên nhân khác nhau, chẳng hạn như:\n\n" +
                  "1. **Chưa nhận biết được nguy hiểm:** Trẻ em thường hiếu động, tò mò, thích khám phá nhưng chưa có nhiều kinh nghiệm để nhận biết nơi nào an toàn hoặc nguy hiểm.\n" +
                  "2. **Thiếu kỹ năng an toàn:** Chưa biết bơi, chưa biết cách tự cứu hoặc không biết phải làm gì khi gặp sự cố dưới nước.\n" +
                  "3. **Không có người lớn giám sát:** Tự chơi gần ao, hồ, sông, suối hoặc tự đi bơi khi không có người lớn đi cùng.\n" +
                  "4. **Môi trường không an toàn:** Ao, hồ, giếng, hố nước không có rào chắn hoặc biển cảnh báo.\n" +
                  "5. **Thời tiết, thiên tai:** Mưa lớn, lũ lụt, dòng nước chảy xiết hoặc nước dâng bất ngờ cũng có thể gây nguy hiểm.\n\n" +
                  "Vì vậy, em cần học cách nhận biết nguy hiểm và luôn tuân thủ các quy tắc an toàn khi ở gần nước."
    },

    {
        id: "children_curious_water_risk",
        keywords: [
            'vì sao trẻ em dễ bị đuối nước',
            'tại sao học sinh dễ gặp nguy hiểm dưới nước',
            'tre em de bi duoi nuoc vi sao',
            'trẻ hiếu động có dễ bị đuối nước không'
        ],
        response: "**Trẻ em dễ gặp nguy hiểm dưới nước vì còn hiếu động và chưa có nhiều kinh nghiệm.**\n\n" +
                  "Ở lứa tuổi tiểu học, các em thường thích chạy nhảy, khám phá, chơi cùng bạn bè và đôi khi muốn thử những điều mới lạ.\n\n" +
                  "Nhưng vì chưa nhận biết hết các nguy hiểm như nước sâu, đáy trơn, dòng chảy mạnh hoặc hố nước bất ngờ nên trẻ em có thể gặp tai nạn nếu chủ quan.\n\n" +
                  "Vì vậy, em không nên thử những trò mạo hiểm gần nước và cần hỏi người lớn trước khi tham gia các hoạt động dưới nước."
    },

    {
        id: "lack_water_safety_knowledge",
        keywords: [
            'thiếu kỹ năng có dễ bị đuối nước không',
            'không biết kỹ năng an toàn dưới nước',
            'thieu ky nang duoi nuoc',
            'vì sao cần học kỹ năng phòng chống đuối nước'
        ],
        response: "**Thiếu kiến thức và kỹ năng an toàn làm nguy cơ đuối nước tăng lên.**\n\n" +
                  "Nếu một người không biết nhận ra vùng nước sâu, dòng chảy mạnh hoặc nơi nguy hiểm thì rất dễ đưa ra quyết định sai, chẳng hạn như tự ý xuống nước hoặc bơi ở nơi không an toàn.\n\n" +
                  "Ngoài việc biết bơi, chúng ta còn cần biết cách giữ bình tĩnh, tự nổi, gọi trợ giúp và cách xử lý khi gặp tình huống bất ngờ.\n\n" +
                  "Vì vậy, học bơi thôi chưa đủ, em còn cần học các kỹ năng an toàn trong môi trường nước."
    },

    {
        id: "no_adult_supervision_risk",
        keywords: [
            'không có người lớn có nguy hiểm không',
            'vì sao cần người lớn trông khi bơi',
            'khong co nguoi lon giam sat',
            'đi bơi không có người lớn được không'
        ],
        response: "**Không có người lớn giám sát sẽ làm nguy cơ tai nạn tăng lên.**\n\n" +
                  "Khi xảy ra sự cố như trượt chân, chuột rút, sặc nước hoặc bị dòng nước cuốn, trẻ em có thể không đủ khả năng tự xử lý.\n\n" +
                  "Người lớn có thể phát hiện nguy hiểm sớm, nhắc nhở em tránh xa nơi không an toàn và kịp thời gọi cứu hộ khi cần.\n\n" +
                  "Vì vậy, em không nên tự ý đi bơi, tắm sông, tắm hồ hoặc chơi gần vùng nước khi không có người lớn đáng tin cậy đi cùng."
    },

    {
        id: "environment_safety_risk",
        keywords: [
            'môi trường nước không an toàn là gì',
            'noi co nuoc khong an toan',
            'vì sao ao hồ không có rào nguy hiểm',
            'không có biển cảnh báo có nguy hiểm không'
        ],
        response: "**Môi trường nước không an toàn là nơi có nguy cơ gây tai nạn nhưng chưa được che chắn hoặc cảnh báo đầy đủ.**\n\n" +
                  "Ví dụ như giếng không có nắp, ao không có hàng rào, hố nước không có biển cảnh báo, bể bơi không có người giám sát hoặc phương tiện đường thủy không có đủ áo phao.\n\n" +
                  "Ở những nơi này, chỉ một chút bất cẩn cũng có thể dẫn đến tai nạn.\n\n" +
                  "Nếu em phát hiện một nơi nguy hiểm, hãy tránh xa và báo ngay cho cha mẹ, thầy cô hoặc người lớn."
    },

    {
        id: "natural_disaster_drowning_risk",
        keywords: [
            'mưa lũ gây đuối nước như thế nào',
            'thiên tai có gây đuối nước không',
            'mua lu gay duoi nuoc',
            'vì sao lũ lụt nguy hiểm với trẻ em'
        ],
        response: "**Mưa lớn và lũ lụt có thể làm nguy cơ đuối nước tăng rất cao.**\n\n" +
                  "Khi mưa lớn, nước có thể dâng nhanh, dòng chảy mạnh hơn và xuất hiện những vùng nước xoáy hoặc chảy xiết.\n\n" +
                  "Nước lũ còn có thể che khuất hố sâu, cống thoát nước hoặc những vật nguy hiểm ở dưới chân.\n\n" +
                  "Vì vậy, khi có mưa lớn hoặc lũ, em không được tự ý đi qua vùng nước ngập và phải làm theo hướng dẫn của người lớn."
    },

    {
        id: "go_swimming_without_permission",
        keywords: [
            'tự ý đi bơi có được không',
            'không xin phép bố mẹ đi bơi',
            'tu y di boi',
            'đi tắm sông mà không báo bố mẹ',
            'đi bơi không nói với gia đình'
        ],
        response: "**Em không nên tự ý đi bơi mà không báo cho gia đình.**\n\n" +
                  "Nếu người lớn không biết em đang ở đâu thì khi xảy ra sự cố sẽ rất khó hỗ trợ kịp thời.\n\n" +
                  "Trước khi đi bơi, em cần báo cho bố mẹ hoặc người chăm sóc biết mình đi đâu, đi với ai và chỉ tham gia khi có người lớn phù hợp giám sát.\n\n" +
                  "Đặc biệt, không được tự rủ nhau đi tắm sông, ao hoặc hồ khi không có người lớn đi cùng."
    },

    {
        id: "friends_invite_river_swimming",
        keywords: [
            'bạn rủ đi tắm sông có nên đi không',
            'bạn rủ đi tắm hồ',
            'ban ru di tam song',
            'rủ nhau đi bơi có nguy hiểm không',
            'bạn bè rủ đi tắm ao'
        ],
        response: "**Nếu bạn rủ em tự đi tắm sông, hồ hoặc ao thì em nên từ chối.**\n\n" +
                  "Sông, hồ và ao có thể có chỗ sâu bất ngờ, đáy trơn, bùn lầy, dòng nước mạnh hoặc vùng nước xoáy mà các em không nhận ra.\n\n" +
                  "Ngay cả khi trong nhóm có bạn biết bơi thì điều đó cũng không bảo đảm an toàn cho tất cả mọi người.\n\n" +
                  "Em hãy rủ các bạn chọn trò chơi ở nơi an toàn và chỉ đi bơi khi có người lớn giám sát."
    },

    {
        id: "swimming_alone_danger",
        keywords: [
            'bơi một mình có nguy hiểm không',
            'có nên bơi một mình',
            'boi mot minh co sao khong',
            'đi bơi một mình được không'
        ],
        response: "**Không nên bơi một mình.**\n\n" +
                  "Nếu em bất ngờ bị mệt, chuột rút, sặc nước hoặc gặp dòng nước mạnh thì sẽ không có ai ở gần để phát hiện và gọi trợ giúp.\n\n" +
                  "Em chỉ nên bơi tại nơi an toàn, có người lớn giám sát và có người phụ trách cứu hộ khi cần.\n\n" +
                  "Hãy nhớ: biết bơi không có nghĩa là có thể bơi một mình."
    },

    {
        id: "diving_headfirst_risk",
        keywords: [
            'nhảy cắm đầu có nguy hiểm không',
            'có được nhảy cắm đầu xuống nước không',
            'nhay cam dau xuong nuoc',
            'lao đầu xuống nước có sao không'
        ],
        response: "**Nhảy cắm đầu xuống nước ở nơi chưa biết rõ độ sâu rất nguy hiểm.**\n\n" +
                  "Nếu nước quá nông hoặc bên dưới có đá, cành cây, vật cứng hay vật sắc nhọn, đầu và cổ của em có thể bị va đập và bị thương nặng.\n\n" +
                  "Vì vậy, em không được tự ý nhảy cắm đầu xuống ao, hồ, sông hoặc những nơi không có hướng dẫn an toàn.\n\n" +
                  "Ở bể bơi, chỉ thực hiện động tác xuống nước theo đúng hướng dẫn của giáo viên hoặc người phụ trách."
    },

    {
        id: "swimming_race_risk",
        keywords: [
            'bơi thi có nguy hiểm không',
            'thi bơi với bạn có sao không',
            'boi thi voi ban',
            'thách nhau bơi xa có nguy hiểm không'
        ],
        response: "**Không nên tự tổ chức bơi thi hoặc thách nhau bơi xa.**\n\n" +
                  "Khi cố thắng bạn, em có thể bơi quá sức, mệt nhanh hoặc đi vào khu vực nước sâu, nước mạnh mà không để ý.\n\n" +
                  "Nếu muốn thi bơi, hãy tham gia hoạt động có giáo viên, huấn luyện viên hoặc người phụ trách tổ chức tại nơi an toàn.\n\n" +
                  "An toàn quan trọng hơn việc thắng hay thua."
    },

    {
        id: "swimming_at_night_risk",
        keywords: [
            'bơi ban đêm có nguy hiểm không',
            'trời tối có được đi bơi không',
            'boi ban dem',
            'tắm sông buổi tối được không'
        ],
        response: "**Không nên bơi khi trời tối.**\n\n" +
                  "Buổi tối, chúng ta khó quan sát độ sâu, vật cản, dòng nước hoặc những thay đổi bất thường ở khu vực xung quanh.\n\n" +
                  "Nếu xảy ra sự cố, người trên bờ cũng khó nhìn thấy để hỗ trợ em.\n\n" +
                  "Vì vậy, em chỉ nên bơi trong thời gian và khu vực được cho phép, có đủ ánh sáng và có người lớn giám sát."
    },

    {
        id: "swimming_during_storm",
        keywords: [
            'mưa có được đi bơi không',
            'sấm chớp có được bơi không',
            'boi khi troi mua',
            'giông sét có được xuống nước không',
            'trời sắp mưa có nên đi bơi'
        ],
        response: "**Không được bơi khi trời đang mưa, có giông, sấm chớp hoặc thời tiết sắp chuyển xấu.**\n\n" +
                  "Mưa có thể làm nước dâng nhanh và dòng chảy thay đổi. Giông, gió lớn và sấm sét cũng làm môi trường nước trở nên rất nguy hiểm.\n\n" +
                  "Nếu em đang ở dưới nước mà thời tiết xấu đi, hãy nghe hướng dẫn của người lớn và rời khỏi khu vực nước càng sớm càng tốt."
    },

    {
        id: "no_warmup_before_swimming",
        keywords: [
            'không khởi động trước khi bơi có sao không',
            'cần khởi động trước khi bơi không',
            'khong khoi dong truoc khi boi',
            'vì sao phải khởi động trước khi xuống nước'
        ],
        response: "**Em nên khởi động kỹ trước khi xuống nước.**\n\n" +
                  "Khởi động giúp cơ thể làm quen với vận động và chuẩn bị cơ bắp, khớp trước khi bơi.\n\n" +
                  "Nếu xuống nước khi chưa khởi động hoặc vừa vận động quá sức, em có thể dễ bị mệt, chuột rút hoặc chấn thương.\n\n" +
                  "Hãy thực hiện các động tác khởi động theo hướng dẫn của giáo viên hoặc người phụ trách trước khi xuống bơi."
    },

    {
        id: "swimming_when_tired",
        keywords: [
            'mệt có được đi bơi không',
            'đang mệt có nên xuống nước không',
            'met co nen boi khong',
            'vừa vận động mệt có được bơi không'
        ],
        response: "**Khi cơ thể đang mệt, em không nên xuống nước.**\n\n" +
                  "Lúc mệt, sức lực của em giảm và cơ thể sẽ khó xử lý nếu xảy ra tình huống bất ngờ.\n\n" +
                  "Bơi khi quá mệt còn có thể làm em nhanh đuối sức hoặc bị chuột rút.\n\n" +
                  "Em hãy nghỉ ngơi cho khỏe và chỉ xuống nước khi cơ thể ở trạng thái tốt, đồng thời phải có người lớn giám sát."
    },

    {
        id: "swimming_when_cold",
        keywords: [
            'lạnh có nên tiếp tục bơi không',
            'đang bơi thấy lạnh phải làm gì',
            'boi thay lanh',
            'rét khi đang bơi có nguy hiểm không'
        ],
        response: "**Nếu đang bơi mà cảm thấy lạnh, run hoặc mệt, em nên ra khỏi nước.**\n\n" +
                  "Đó có thể là dấu hiệu cơ thể đang mất sức. Nếu cố tiếp tục bơi, em sẽ ngày càng mệt và khó giữ an toàn.\n\n" +
                  "Hãy bình tĩnh, báo cho người lớn hoặc nhân viên cứu hộ và từ từ di chuyển đến nơi an toàn."
    },

    {
        id: "eating_while_swimming",
        keywords: [
            'đang bơi có được ăn không',
            'ăn uống khi đang bơi',
            'an khi dang boi',
            'vừa bơi vừa ăn có sao không'
        ],
        response: "**Không nên ăn uống trong lúc đang bơi.**\n\n" +
                  "Việc vừa ăn vừa hoạt động dưới nước có thể làm em mất tập trung và dễ bị sặc.\n\n" +
                  "Khi cần ăn hoặc uống, em nên ra khỏi nước, nghỉ ngơi ở nơi an toàn rồi mới ăn uống."
    },

    {
        id: "swimming_after_full_meal",
        keywords: [
            'ăn no có được đi bơi không',
            'vừa ăn xong có nên bơi không',
            'an no roi di boi',
            'ăn cơm xong xuống nước được không'
        ],
        response: "**Không nên xuống nước ngay sau khi vừa ăn quá no.**\n\n" +
                  "Sau khi ăn no, cơ thể đang cần thời gian để tiêu hóa thức ăn. Nếu vận động mạnh ngay, em có thể thấy khó chịu, buồn nôn, mệt hoặc chuột rút.\n\n" +
                  "Em nên nghỉ ngơi và chỉ đi bơi khi cơ thể cảm thấy thoải mái, đồng thời làm theo hướng dẫn của người lớn."
    },

    {
        id: "playing_near_water_edge",
        keywords: [
            'chơi sát mép ao có nguy hiểm không',
            'chạy nhảy gần hồ có sao không',
            'choi gan mep ao',
            'đùa nghịch cạnh sông có nguy hiểm không'
        ],
        response: "**Chạy nhảy hoặc đùa nghịch sát mép nước rất nguy hiểm.**\n\n" +
                  "Bờ ao, hồ hoặc sông có thể trơn, mềm hoặc bị sạt. Em có thể trượt chân và rơi xuống nước chỉ trong vài giây.\n\n" +
                  "Vì vậy, hãy giữ khoảng cách an toàn với mép nước và chọn nơi khác để chạy nhảy, chơi đùa."
    },

    {
        id: "retrieve_ball_from_water",
        keywords: [
            'bóng rơi xuống sông có nên xuống lấy không',
            'đồ chơi rơi xuống ao phải làm gì',
            'bong roi xuong nuoc',
            'có nên xuống hồ lấy đồ không'
        ],
        response: "**Nếu bóng hoặc đồ chơi rơi xuống ao, hồ, sông thì em không được tự xuống lấy.**\n\n" +
                  "Một món đồ không quan trọng bằng sự an toàn của em. Khu vực đó có thể sâu, trơn hoặc có dòng nước nguy hiểm mà em không nhìn thấy.\n\n" +
                  "Hãy gọi người lớn và đứng ở nơi an toàn. Không cúi sát mép nước hoặc cố với tay để lấy đồ."
    },

    {
        id: "showing_off_swimming",
        keywords: [
            'bơi giỏi có được thể hiện không',
            'thách bạn bơi xa',
            'khoe bơi giỏi có nguy hiểm không',
            'thich the hien khi boi'
        ],
        response: "**Không nên thể hiện bằng những hành động mạo hiểm dưới nước.**\n\n" +
                  "Biết bơi giỏi không có nghĩa là em không thể gặp nguy hiểm. Dòng nước mạnh, chuột rút, mệt hoặc vật cản dưới nước vẫn có thể xảy ra bất ngờ.\n\n" +
                  "Em hãy bơi đúng khu vực, đúng khả năng của mình và luôn tuân thủ hướng dẫn an toàn."
    },

    {
        id: "known_swimmer_overconfidence",
        keywords: [
            'biết bơi rồi có cần cẩn thận không',
            'bơi giỏi có cần người lớn không',
            'biet boi roi co can giam sat',
            'bơi giỏi có bị tai nạn không'
        ],
        response: "**Biết bơi vẫn phải luôn cẩn thận.**\n\n" +
                  "Có những trường hợp trẻ biết bơi nhưng vẫn gặp đuối nước vì chủ quan, bơi ở nơi lạ, gặp nước xoáy, dòng chảy mạnh hoặc không biết kỹ năng tự cứu.\n\n" +
                  "Biết bơi là một kỹ năng rất tốt, nhưng muốn an toàn em còn cần biết nhận diện nguy hiểm, giữ bình tĩnh và tuân thủ các quy tắc phòng tránh đuối nước.\n\n" +
                  "Đừng bao giờ nghĩ rằng mình bơi giỏi nên có thể xuống nước ở bất cứ đâu."
    },
 {
        id: "safe_place_to_swim",
        keywords: [
            'nên bơi ở đâu',
            'chỗ nào an toàn để bơi',
            'boi o dau an toan',
            'nơi nào được phép bơi',
            'đi bơi ở đâu thì an toàn'
        ],
        response: "**Em nên bơi ở nơi được phép và có người quản lý an toàn.**\n\n" +
                  "Ví dụ như bể bơi có giáo viên hoặc nhân viên cứu hộ, khu vực tắm được phép hoạt động và có biển chỉ dẫn rõ ràng.\n\n" +
                  "Không nên tự ý bơi ở ao, hồ, sông, suối hoặc những vùng nước lạ vì độ sâu, dòng chảy và các vật dưới nước có thể rất khó nhận biết.\n\n" +
                  "Trước khi xuống nước, hãy nghe hướng dẫn của người lớn."
    },

    {
        id: "unsafe_place_to_swim",
        keywords: [
            'không được bơi ở đâu',
            'nơi nào không được xuống nước',
            'khong nen boi o dau',
            'chỗ nào cấm bơi',
            'những nơi không nên tắm'
        ],
        response: "**Em không nên bơi ở những nơi có nguy cơ cao.**\n\n" +
                  "Đó là nơi nước sâu, chảy xiết, có xoáy nước, khu vực có biển cấm, hố nước, công trình đang thi công hoặc nơi không có người quản lý.\n\n" +
                  "Em cũng không nên tự ý xuống ao, hồ, sông, suối, đập hoặc những vùng nước mà mình không biết rõ.\n\n" +
                  "Nếu không chắc nơi đó có an toàn hay không, hãy coi đó là nơi nguy hiểm và hỏi người lớn."
    },

    {
        id: "obey_water_warning_signs",
        keywords: [
            'biển cấm bơi có được xuống không',
            'biển cảnh báo nguy hiểm là gì',
            'gap bien cam boi phai lam gi',
            'có biển cấm tắm thì sao',
            'phải làm gì khi thấy biển cảnh báo nước sâu'
        ],
        response: "**Khi thấy biển cấm hoặc biển cảnh báo nguy hiểm, em phải tuân thủ và không xuống nước.**\n\n" +
                  "Biển cảnh báo thường được đặt ở những nơi có nước sâu, dòng chảy mạnh, nước xoáy hoặc có nguy cơ xảy ra tai nạn.\n\n" +
                  "Không được vượt qua hàng rào, dây chắn hoặc thử xuống nước chỉ vì thấy người khác đang ở đó.\n\n" +
                  "Nếu chưa hiểu biển báo có ý nghĩa gì, hãy hỏi người lớn."
    },

    {
        id: "stay_away_from_open_water",
        keywords: [
            'có nên chơi gần ao hồ không',
            'có được chơi gần sông suối không',
            'choi gan ao ho duoc khong',
            'ở gần vùng nước phải làm gì'
        ],
        response: "**Khi ở gần ao, hồ, sông, suối, em cần luôn giữ khoảng cách an toàn.**\n\n" +
                  "Không chạy nhảy sát mép nước, không xô đẩy nhau và không cúi người ra quá xa để lấy đồ vật.\n\n" +
                  "Bờ đất có thể trơn hoặc bị sạt bất ngờ khiến em rơi xuống nước.\n\n" +
                  "Tốt nhất hãy chọn nơi vui chơi cách xa vùng nước và có người lớn ở gần."
    },

    {
        id: "do_not_invite_friends_swimming",
        keywords: [
            'có được rủ bạn đi tắm không',
            'rủ bạn đi bơi không có người lớn',
            'ru ban di tam song',
            'nghỉ hè rủ nhau đi bơi được không'
        ],
        response: "**Không nên tự rủ nhau đi tắm hoặc đi bơi khi không có người lớn đi cùng.**\n\n" +
                  "Một nhóm bạn có thể nghĩ rằng đông người sẽ an toàn hơn, nhưng khi xảy ra sự cố các em thường chưa có đủ kỹ năng để cứu nhau đúng cách.\n\n" +
                  "Đặc biệt trong dịp nghỉ hè hoặc sau khi tan học, không được tự ý ra ao, hồ, sông, suối để tắm hoặc vui chơi.\n\n" +
                  "Hãy báo cho gia đình và chỉ đi bơi khi có người lớn giám sát."
    },

    {
        id: "tell_family_before_swimming",
        keywords: [
            'đi bơi có cần báo bố mẹ không',
            'đi chơi gần nước có cần nói gia đình',
            'di boi co can bao gia dinh',
            'phải báo ai trước khi đi bơi'
        ],
        response: "**Có. Trước khi đi bơi hoặc đến nơi có nước, em cần báo cho bố mẹ hoặc người chăm sóc biết.**\n\n" +
                  "Hãy nói rõ em đi đâu, đi với ai và khi nào về.\n\n" +
                  "Việc này giúp gia đình biết em đang ở đâu và có thể hỗ trợ nhanh nếu xảy ra tình huống bất ngờ.\n\n" +
                  "Không được tự ý bỏ đi bơi mà người lớn không biết."
    },

    {
        id: "stop_swimming_when_tired",
        keywords: [
            'đang bơi mệt thì phải làm gì',
            'bơi thấy đuối sức phải làm sao',
            'dang boi bi met phai lam gi',
            'mệt khi đang ở dưới nước'
        ],
        response: "**Nếu đang bơi mà thấy mệt, lạnh hoặc đuối sức, em cần dừng lại và tìm cách ra khỏi nước.**\n\n" +
                  "Hãy cố gắng giữ bình tĩnh, bám vào thành bể, dây phao hoặc vật chắc chắn nếu ở gần.\n\n" +
                  "Nếu đã được học kỹ năng nổi ngửa, em có thể dùng kỹ năng này để nghỉ và giữ sức trong lúc chờ hỗ trợ.\n\n" +
                  "Hãy gọi người lớn hoặc nhân viên cứu hộ và tuyệt đối không cố tiếp tục bơi khi cơ thể đã mệt."
    },

    {
        id: "do_not_swim_in_deep_fast_water",
        keywords: [
            'nước sâu có được bơi không',
            'nước chảy xiết có được tắm không',
            'nuoc chay xiet co duoc boi',
            'nước xoáy có được xuống không',
            'có người lớn thì được bơi chỗ nước sâu không'
        ],
        response: "**Không. Trẻ em không được bơi ở nơi nước sâu, chảy xiết hoặc có xoáy nước.**\n\n" +
                  "Những vùng nước này có thể làm em mất sức rất nhanh hoặc cuốn em khỏi vị trí an toàn.\n\n" +
                  "Ngay cả khi có người lớn ở gần hoặc em biết bơi, các khu vực nước sâu, chảy xiết và nước xoáy vẫn rất nguy hiểm.\n\n" +
                  "Hãy tránh xa và lựa chọn nơi bơi được phép."
    },

    {
        id: "wear_proper_swim_clothes",
        keywords: [
            'đi bơi nên mặc gì',
            'quần áo khi bơi thế nào',
            'mac gi khi di boi',
            'trang phục đi bơi'
        ],
        response: "**Khi đi bơi, em nên mặc trang phục gọn gàng và phù hợp.**\n\n" +
                  "Quần áo quá rộng, quá dài hoặc có nhiều dây có thể gây vướng khi vận động dưới nước.\n\n" +
                  "Nếu người lớn hoặc nơi tổ chức yêu cầu sử dụng áo phao hoặc dụng cụ hỗ trợ nổi, em cần mặc đúng cách và đúng kích cỡ.\n\n" +
                  "Trước khi xuống nước, hãy kiểm tra lại trang phục và làm theo hướng dẫn của người phụ trách."
    },

    {
        id: "follow_swimming_teacher",
        keywords: [
            'học bơi phải nghe ai',
            'đi học bơi cần làm gì',
            'hoc boi can tuan thu gi',
            'có được tự tập bơi không'
        ],
        response: "**Khi học bơi, em cần làm đúng hướng dẫn của giáo viên hoặc người phụ trách.**\n\n" +
                  "Không tự ý xuống nước trước khi được cho phép, không chuyển sang khu vực khác và không thực hiện động tác mà mình chưa được hướng dẫn.\n\n" +
                  "Lớp học bơi an toàn cần có người quản lý, người hướng dẫn và phương tiện cứu hộ cần thiết.\n\n" +
                  "Học đúng cách giúp em vừa tiến bộ vừa bảo vệ được bản thân."
    },

    {
        id: "do_not_push_friends_into_water",
        keywords: [
            'có được đẩy bạn xuống nước không',
            'xô bạn xuống hồ có sao không',
            'day ban xuong nuoc',
            'đùa đẩy nhau ở bể bơi'
        ],
        response: "**Tuyệt đối không xô, đẩy hoặc kéo bạn xuống nước để đùa.**\n\n" +
                  "Bạn có thể chưa biết bơi, bị bất ngờ, sặc nước hoặc va vào thành bể và bị thương.\n\n" +
                  "Ở khu vực bể bơi và gần nước, em cần giữ trật tự, không chạy nhảy, xô đẩy hay chơi những trò khiến người khác mất thăng bằng.\n\n" +
                  "Một trò đùa dưới nước có thể trở thành tai nạn rất nhanh."
    },

    {
        id: "do_not_cross_water_barriers",
        keywords: [
            'có được trèo qua rào ao hồ không',
            'vượt rào xuống nước được không',
            'treo qua hang rao ho boi',
            'qua dây chắn xuống tắm'
        ],
        response: "**Không được trèo qua hàng rào, dây chắn hoặc khu vực đã được ngăn lại quanh nơi có nước.**\n\n" +
                  "Những rào chắn này được đặt để ngăn mọi người đến gần khu vực nguy hiểm như ao sâu, hố nước hoặc nơi chưa bảo đảm an toàn.\n\n" +
                  "Nếu đồ vật của em rơi vào phía bên kia, hãy nhờ người lớn giúp thay vì tự trèo qua."
    },

    {
        id: "report_water_hazard_to_adult",
        keywords: [
            'thấy hố nước nguy hiểm phải làm gì',
            'thấy giếng không có nắp phải làm sao',
            'bao nguoi lon khi thay noi nguy hiem',
            'thấy ao không có rào chắn'
        ],
        response: "**Nếu phát hiện nơi có nguy cơ đuối nước, em nên báo cho người lớn.**\n\n" +
                  "Ví dụ như giếng không có nắp, ao không có rào chắn, hố nước sâu, cống bị mất nắp hoặc biển cảnh báo bị hỏng.\n\n" +
                  "Em không nên tự sửa, tự lại gần kiểm tra hoặc đứng cạnh nơi nguy hiểm.\n\n" +
                  "Hãy báo cho bố mẹ, thầy cô hoặc người lớn có trách nhiệm để họ xử lý an toàn."
    },

    {
        id: "water_safety_what_should_do",
        keywords: [
            'ở gần nước nên làm gì',
            'những việc nên làm để an toàn dưới nước',
            'nen lam gi de an toan khi boi',
            'đi bơi nên làm gì'
        ],
        response: "**Những việc em NÊN làm để an toàn khi ở gần nước:**\n\n" +
                  "✅ Đi cùng và nghe hướng dẫn của người lớn.\n" +
                  "✅ Bơi ở nơi được phép và có người giám sát.\n" +
                  "✅ Khởi động trước khi xuống nước.\n" +
                  "✅ Tuân thủ biển báo, hàng rào và quy định an toàn.\n" +
                  "✅ Ra khỏi nước khi thấy lạnh, mệt hoặc đuối sức.\n" +
                  "✅ Báo cho người lớn khi phát hiện nơi có nguy cơ nguy hiểm.\n\n" +
                  "Biết phòng tránh nguy hiểm là một kỹ năng rất quan trọng để bảo vệ bản thân."
    },

    {
        id: "water_safety_what_not_to_do",
        keywords: [
            'ở gần nước không nên làm gì',
            'những việc không được làm khi đi bơi',
            'khong nen lam gi khi boi',
            'điều cấm khi ở gần ao hồ'
        ],
        response: "**Những việc em KHÔNG NÊN làm khi ở gần nước:**\n\n" +
                  "❌ Không tự ý xuống nước.\n" +
                  "❌ Không bơi một mình.\n" +
                  "❌ Không rủ nhau đi tắm ao, hồ, sông, suối.\n" +
                  "❌ Không chạy nhảy hoặc xô đẩy sát mép nước.\n" +
                  "❌ Không xuống nơi nước sâu, chảy xiết hoặc có xoáy.\n" +
                  "❌ Không bơi khi trời mưa, giông, sét hoặc khi cơ thể đang mệt.\n" +
                  "❌ Không bỏ qua biển cấm và biển cảnh báo.\n\n" +
                  "Hãy nhớ: **thấy nguy hiểm thì tránh xa và gọi người lớn giúp đỡ.**"
    },
{
        id: "home_drowning_risks_general",
        keywords: [
            'trong nhà có những nguy cơ đuối nước nào',
            'nguy cơ đuối nước trong gia đình',
            'o nha co the bi duoi nuoc o dau',
            'những chỗ nguy hiểm có nước trong nhà',
            'ở nhà cần chú ý gì để tránh đuối nước'
        ],
        response: "**Trong gia đình cũng có nhiều nơi có thể gây nguy cơ đuối nước.**\n\n" +
                  "Một số nơi cần đặc biệt chú ý là giếng, bể nước, lu, chum, thùng chứa nước, ao cá, hồ bơi, mương hoặc hố nước quanh nhà.\n\n" +
                  "Với học sinh tiểu học, nguy cơ thường gặp hơn là chơi đùa, bắt cá hoặc đến gần ao, hồ, sông, suối quanh nhà mà không có người lớn giám sát.\n\n" +
                  "Vì vậy, em cần biết những khu vực nguy hiểm quanh nhà và không tự ý đến gần hoặc xuống nước."
    },

    {
        id: "cover_water_containers",
        keywords: [
            'bể nước có cần đậy nắp không',
            'chum nước có cần đậy không',
            'lu nước phải làm sao cho an toàn',
            'be nuoc co can day nap',
            'vật chứa nước có cần che chắn không'
        ],
        response: "**Có. Các dụng cụ chứa nước trong gia đình cần được đậy hoặc che chắn an toàn.**\n\n" +
                  "Giếng, bể nước, lu, chum và các vật chứa nước cần có nắp đậy chắc chắn để trẻ em không thể vô tình ngã vào.\n\n" +
                  "Nắp đậy không nên chỉ đặt hờ mà cần được gài hoặc khóa chắc chắn khi cần thiết.\n\n" +
                  "Nếu em thấy nắp bể hoặc nắp giếng bị mở, không chắc chắn hoặc bị hỏng, hãy tránh xa và báo ngay cho người lớn."
    },

    {
        id: "well_cover_locked",
        keywords: [
            'giếng phải đậy thế nào',
            'nắp giếng cần khóa không',
            'gieng nuoc phai che the nao',
            'giếng không có nắp phải làm gì'
        ],
        response: "**Giếng nước cần được che chắn thật cẩn thận.**\n\n" +
                  "Nắp giếng phải chắc chắn và được gài hoặc khóa để trẻ em không thể tự mở.\n\n" +
                  "Em không nên đứng sát miệng giếng, trèo lên thành giếng hoặc tự mở nắp giếng để nhìn xuống.\n\n" +
                  "Nếu thấy giếng không có nắp hoặc nắp không an toàn, hãy báo cho người lớn ngay."
    },

    {
        id: "bucket_basin_water_at_home",
        keywords: [
            'xô chậu có nước có nguy hiểm không',
            'thau nước có thể gây đuối nước không',
            'xo chau co nuoc co nguy hiem',
            'nước trong xô ít có sao không',
            'ít nước trong chậu có nguy hiểm không'
        ],
        response: "**Xô, chậu hoặc thau có nước vẫn có thể gây nguy hiểm, đặc biệt đối với trẻ nhỏ.**\n\n" +
                  "Khi không sử dụng, người lớn nên đổ hết nước hoặc đặt các vật chứa nước ở nơi trẻ nhỏ không thể tiếp cận.\n\n" +
                  "Em cũng không nên rủ em nhỏ nghịch nước trong xô, chậu hoặc thùng nước khi không có người lớn trông coi.\n\n" +
                  "Hãy nhớ: lượng nước ít không có nghĩa là hoàn toàn an toàn."
    },

    {
        id: "small_water_amount_risk",
        keywords: [
            'nước ít có gây đuối nước không',
            'ít nước có nguy hiểm không',
            'nuoc it co bi duoi nuoc khong',
            'chỉ có một ít nước có sao không'
        ],
        response: "**Có. Một lượng nước nhỏ vẫn có thể gây nguy hiểm, nhất là với trẻ nhỏ.**\n\n" +
                  "Đuối nước có thể xảy ra rất nhanh và đôi khi rất âm thầm.\n\n" +
                  "Vì vậy, các vật chứa nước khi không sử dụng nên được làm rỗng, đặt ngoài tầm với của trẻ nhỏ hoặc che chắn để trẻ không thể tự tiếp cận.\n\n" +
                  "Nếu trong nhà có em nhỏ, em cũng nên nhắc người lớn khi thấy xô, chậu hoặc thùng nước đang để ở nơi không an toàn."
    },

    {
        id: "home_pond_fence",
        keywords: [
            'ao nhà có cần rào không',
            'ao cá cần làm gì để an toàn',
            'ao quanh nha co can rao',
            'nhà có ao phải phòng đuối nước thế nào'
        ],
        response: "**Ao trong hoặc cạnh nhà cần có rào chắn chắc chắn.**\n\n" +
                  "Bờ ao có thể trơn, mềm hoặc bị sạt khiến trẻ em dễ trượt chân rơi xuống nước.\n\n" +
                  "Rào chắn giúp hạn chế trẻ em tự ý đến sát mép ao hoặc xuống nước khi không có người lớn.\n\n" +
                  "Em không nên trèo qua hàng rào để chơi, bắt cá hoặc lấy đồ vật rơi xuống ao."
    },

    {
        id: "home_swimming_pool_fence",
        keywords: [
            'hồ bơi ở nhà có cần rào không',
            'bể bơi gia đình có cần che chắn không',
            'ho boi tai nha can lam gi',
            'nhà có hồ bơi làm sao cho an toàn'
        ],
        response: "**Hồ bơi trong gia đình cũng cần được quản lý và che chắn cẩn thận.**\n\n" +
                  "Nếu có thể, khu vực hồ bơi nên có rào chắn để trẻ em không tự ý tiếp cận khi không có người lớn.\n\n" +
                  "Em không được tự ý xuống hồ bơi chỉ vì hồ ở ngay trong nhà hoặc vì em đã biết bơi.\n\n" +
                  "Mỗi lần xuống nước vẫn cần có người lớn giám sát."
    },

    {
        id: "play_near_home_pond",
        keywords: [
            'chơi gần ao nhà có được không',
            'choi gan ao nha',
            'bắt cá ở ao gần nhà có nguy hiểm không',
            'ra ao sau nhà chơi được không'
        ],
        response: "**Không nên chơi một mình gần ao ở nhà hoặc quanh khu dân cư.**\n\n" +
                  "Học sinh tiểu học có thể gặp nguy hiểm khi chơi đùa, bắt cá, nhặt đồ hoặc chạy sát mép ao.\n\n" +
                  "Chỉ cần trượt chân hoặc bước nhầm vào chỗ sâu là có thể xảy ra tai nạn.\n\n" +
                  "Nếu muốn đến gần ao để tham gia một hoạt động nào đó, em cần có người lớn đi cùng và giám sát."
    },

    {
        id: "catch_fish_near_water",
        keywords: [
            'bắt cá có nguy hiểm không',
            'xuống ao bắt cá được không',
            'bat ca o ao co nguy hiem',
            'bắt cua bắt cá gần sông có sao không'
        ],
        response: "**Bắt cá, bắt cua hoặc nghịch nước ở ao, hồ, sông, suối có thể rất nguy hiểm.**\n\n" +
                  "Bờ nước thường trơn, đáy có thể sâu bất ngờ và em có thể mất thăng bằng khi mải nhìn hoặc cố bắt con vật dưới nước.\n\n" +
                  "Vì vậy, em không nên tự ý xuống ao, hồ hoặc lội ra nước để bắt cá khi không có người lớn hướng dẫn và bảo đảm an toàn."
    },

    {
        id: "home_child_supervision",
        keywords: [
            'trẻ nhỏ gần nước có cần người lớn trông không',
            'vì sao phải trông trẻ khi gần nước',
            'tre nho gan nuoc can giam sat',
            'có được để em nhỏ chơi với nước một mình không'
        ],
        response: "**Trẻ nhỏ cần được người lớn giám sát khi ở gần nước.**\n\n" +
                  "Trẻ nhỏ chưa thể tự nhận biết và xử lý tốt các tình huống nguy hiểm. Vì vậy, không nên để trẻ chơi một mình gần giếng, ao, hồ, bể nước hoặc các nơi có nước.\n\n" +
                  "Người trông trẻ cần thực sự quan sát, không nên mải dùng điện thoại, xem tivi hoặc làm việc khác mà không để ý đến trẻ.\n\n" +
                  "Nếu em thấy một em nhỏ đang chơi một mình gần nước, hãy gọi người lớn đến ngay."
    },

    {
        id: "do_not_leave_small_child_alone_water",
        keywords: [
            'có được để em nhỏ một mình gần nước không',
            'de tre mot minh gan nuoc',
            'em bé nghịch nước một mình có sao không',
            'để trẻ nhỏ tự chơi gần ao được không'
        ],
        response: "**Không. Không nên để trẻ nhỏ một mình ở nơi có nước.**\n\n" +
                  "Trẻ nhỏ có thể trượt chân, ngã vào nước hoặc cúi người quá xa mà không biết cách tự thoát ra.\n\n" +
                  "Đuối nước có thể xảy ra rất nhanh nên sự giám sát của người lớn phải liên tục.\n\n" +
                  "Nếu em đang chơi cùng em nhỏ và thấy nơi đó có nước, hãy gọi người lớn hỗ trợ thay vì tự mình trông coi ở nơi nguy hiểm."
    },

    {
        id: "tell_family_when_leaving_home",
        keywords: [
            'ra khỏi nhà có cần báo bố mẹ không',
            'đi chơi phải nói gì với gia đình',
            'ra ngoai co can bao gia dinh',
            'đi đâu có cần nói cho bố mẹ biết không'
        ],
        response: "**Khi ra khỏi nhà, em nên báo cho gia đình biết rõ mình đi đâu.**\n\n" +
                  "Em cần nói cho bố mẹ hoặc người chăm sóc biết: **đi đâu, làm gì, đi cùng ai và dự kiến trong bao lâu.**\n\n" +
                  "Điều này đặc biệt quan trọng nếu nơi em đến có ao, hồ, sông, suối, hồ bơi hoặc vùng nước mở.\n\n" +
                  "Không nên tự ý đi chơi rồi để gia đình không biết em đang ở đâu."
    },

    {
        id: "tell_family_who_with_how_long",
        keywords: [
            'khi đi chơi cần báo những gì',
            'phải nói gì trước khi ra khỏi nhà',
            'di choi can bao gi',
            'bố mẹ cần biết những gì khi em ra ngoài'
        ],
        response: "**Trước khi ra ngoài, em nên nói cho gia đình 4 điều:**\n\n" +
                  "1. **Em đi đâu.**\n" +
                  "2. **Em đi làm gì.**\n" +
                  "3. **Em đi cùng ai.**\n" +
                  "4. **Em dự kiến đi trong bao lâu hoặc khi nào về.**\n\n" +
                  "Nhờ vậy, gia đình có thể biết nơi em đang ở và hỗ trợ nhanh hơn nếu có vấn đề xảy ra."
    },

    {
        id: "friend_invites_water_place_from_home",
        keywords: [
            'bạn đến rủ ra ao chơi thì sao',
            'bạn rủ ra sông chơi phải làm gì',
            'ban ru ra ao choi',
            'bạn rủ đi tắm khi bố mẹ không biết'
        ],
        response: "**Nếu bạn rủ em đến ao, hồ, sông, suối hoặc đi tắm mà chưa có sự đồng ý của gia đình, em nên từ chối.**\n\n" +
                  "Hãy báo cho bố mẹ hoặc người chăm sóc trước. Không nên nghĩ rằng đi cùng nhiều bạn thì sẽ an toàn.\n\n" +
                  "Nếu muốn đi bơi, hãy chọn nơi được phép và phải có người lớn phù hợp giám sát."
    },

    {
        id: "open_water_near_home",
        keywords: [
            'vùng nước mở gần nhà là gì',
            'những vùng nước mở quanh nhà',
            'vung nuoc mo gan nha',
            'ao hồ kênh mương quanh nhà có nguy hiểm không'
        ],
        response: "**Vùng nước mở là những nơi có nước mà con người có thể tiếp cận như ao, hồ, sông, suối, kênh, mương hoặc hố nước.**\n\n" +
                  "Những nơi này có thể ở rất gần nhà nhưng vẫn tiềm ẩn nguy hiểm, đặc biệt khi không có rào chắn hoặc biển cảnh báo.\n\n" +
                  "Em không nên tự ý đến gần, chơi đùa hoặc xuống nước khi không có người lớn giám sát."
    },

    {
        id: "uncovered_water_tank_action",
        keywords: [
            'thấy bể nước mở nắp phải làm gì',
            'be nuoc mo nap phai lam gi',
            'thấy chum nước không đậy',
            'thấy vật chứa nước không an toàn phải làm sao'
        ],
        response: "**Nếu thấy bể nước, giếng, chum hoặc vật chứa nước đang mở và không an toàn, em không nên tự xử lý nếu có nguy cơ bị ngã.**\n\n" +
                  "Hãy tránh xa khu vực đó và báo ngay cho bố mẹ hoặc người lớn.\n\n" +
                  "Người lớn sẽ kiểm tra, đậy nắp hoặc che chắn đúng cách.\n\n" +
                  "Em cũng nên nhắc các em nhỏ khác không đến gần trong lúc chờ người lớn xử lý."
    },

    {
        id: "broken_pond_fence_action",
        keywords: [
            'thấy hàng rào ao bị hỏng phải làm gì',
            'rao ao bi hong phai lam sao',
            'rào hồ bị đổ thì sao',
            'thấy chỗ chắn ao không an toàn'
        ],
        response: "**Nếu thấy hàng rào quanh ao, hồ hoặc bể bơi bị hỏng, em hãy báo cho người lớn.**\n\n" +
                  "Không nên tự trèo vào khu vực đó để kiểm tra hoặc sửa chữa.\n\n" +
                  "Trong khi chờ xử lý, hãy tránh xa và nhắc các bạn, em nhỏ không đến gần nơi nguy hiểm."
    },

    {
        id: "bathroom_water_safety",
        keywords: [
            'nhà tắm có nguy cơ đuối nước không',
            'phòng tắm có nguy hiểm với trẻ nhỏ không',
            'nha tam co nguy hiem khong',
            'trẻ nhỏ trong nhà tắm cần chú ý gì'
        ],
        response: "**Nhà tắm cũng có thể có nguy cơ đối với trẻ nhỏ nếu có bồn, xô, chậu hoặc vật chứa nước.**\n\n" +
                  "Trẻ nhỏ không nên ở một mình trong khu vực có nước mà không có người lớn quan sát.\n\n" +
                  "Sau khi sử dụng, các vật chứa nước cần được xử lý an toàn và không để trẻ nhỏ tự nghịch nước."
    },

    {
        id: "home_safety_checklist",
        keywords: [
            'làm sao để nhà an toàn phòng đuối nước',
            'cách phòng đuối nước tại gia đình',
            'phong duoi nuoc tai nha',
            'gia đình cần làm gì để phòng đuối nước'
        ],
        response: "**Để phòng tránh đuối nước tại gia đình, cần chú ý:**\n\n" +
                  "✅ Giếng, bể, lu và các vật chứa nước phải được đậy chắc chắn.\n" +
                  "✅ Ao, hồ bơi trong hoặc cạnh nhà cần có rào chắn an toàn.\n" +
                  "✅ Không để trẻ nhỏ tự chơi với nước khi không có người lớn giám sát.\n" +
                  "✅ Nhắc trẻ nhận biết và tránh xa các khu vực có nguy cơ.\n" +
                  "✅ Khi trẻ ra khỏi nhà, gia đình cần biết trẻ đi đâu, làm gì, đi cùng ai và trong bao lâu.\n\n" +
                  "Một môi trường sống an toàn sẽ giúp giảm rất nhiều nguy cơ xảy ra tai nạn đuối nước."
    },

    {
        id: "child_report_home_water_hazard",
        keywords: [
            'em thấy chỗ nguy hiểm ở nhà thì làm gì',
            'thay noi nguy hiem trong nha phai lam sao',
            'phát hiện nguy cơ đuối nước trong nhà',
            'thấy ao giếng nguy hiểm báo ai'
        ],
        response: "**Nếu em phát hiện một nơi có nguy cơ đuối nước trong hoặc quanh nhà, hãy báo cho người lớn.**\n\n" +
                  "Ví dụ: giếng không có nắp, bể nước mở, hàng rào ao bị hỏng, hố nước chưa được che chắn hoặc em nhỏ đang chơi gần nước.\n\n" +
                  "Em không nên tự đến gần để kiểm tra nếu việc đó có thể làm mình gặp nguy hiểm.\n\n" +
                  "Việc tốt nhất là **tránh xa – cảnh báo người khác – báo người lớn.**"
    },
 {
        id: "community_water_risk_general",
        keywords: [
            'nguy hiểm ngoài đường',
            'nơi có nước nguy hiểm',
            'vùng nước nguy hiểm',
            'choi gan nuoc',
            'gần ao hồ',
            'gần sông suối',
            'ngoài đường có nước',
            'nơi dễ đuối nước'
        ],
        response: "**Ngoài cộng đồng có nhiều nơi có thể gây nguy cơ đuối nước.**\n\n" +
                  "Em cần chú ý các khu vực như ao, hồ, sông, suối, kênh, mương, hố công trình, hố lấy đất, hố lấy cát, ao nuôi cá hoặc cống thoát nước.\n\n" +
                  "Nhiều nơi không có hàng rào hoặc biển cảnh báo nên nhìn bên ngoài có thể không thấy nguy hiểm.\n\n" +
                  "Khi gặp những khu vực như vậy, em nên **tránh xa, không chơi đùa và báo cho người lớn nếu thấy mất an toàn**."
    },

    {
        id: "community_pond_risk",
        keywords: [
            'ao công cộng',
            'ao làng',
            'ao sâu',
            'ao không rào',
            'ao khong rao',
            'chơi gần ao',
            'ao có nguy hiểm',
            'bờ ao trơn'
        ],
        response: "**Ao ở khu dân cư có thể rất nguy hiểm nếu không được rào chắn.**\n\n" +
                  "Bờ ao có thể trơn, mềm hoặc sạt xuống. Độ sâu của ao cũng không đều và có thể có bùn lầy ở dưới đáy.\n\n" +
                  "Em không nên chạy nhảy sát mép ao, xuống bắt cá hoặc cố lấy đồ vật rơi xuống nước.\n\n" +
                  "Nếu thấy ao không có rào chắn, hãy giữ khoảng cách và báo cho người lớn."
    },

    {
        id: "river_bank_risk",
        keywords: [
            'gần sông',
            'bờ sông',
            'chơi bờ sông',
            'choi gan song',
            'sông nguy hiểm',
            'đứng sát sông',
            'ra sông chơi'
        ],
        response: "**Bờ sông là nơi cần đặc biệt cẩn thận.**\n\n" +
                  "Dòng nước ở sông có thể mạnh, độ sâu thay đổi và bờ đất có thể trơn hoặc sạt bất ngờ.\n\n" +
                  "Em không nên chạy nhảy, đùa nghịch hoặc đứng sát mép sông.\n\n" +
                  "Nếu muốn tham gia hoạt động gần sông, cần có người lớn quản lý và bảo đảm an toàn."
    },

    {
        id: "canal_ditch_risk",
        keywords: [
            'kênh mương',
            'mương nước',
            'kenh muong',
            'chơi gần mương',
            'mương sâu',
            'kênh nước nguy hiểm',
            'lội mương'
        ],
        response: "**Kênh và mương nước cũng có thể gây đuối nước.**\n\n" +
                  "Một số mương có thành dốc, trơn và nước chảy nhanh nên khi rơi xuống có thể khó trèo lên.\n\n" +
                  "Em không được tự ý lội, nhảy qua hoặc chơi đùa sát mép kênh, mương.\n\n" +
                  "Khi đi qua khu vực này, hãy đi đúng đường và giữ khoảng cách an toàn."
    },

    {
        id: "construction_water_hole_risk",
        keywords: [
            'hố công trình',
            'ho cong trinh',
            'hố nước công trình',
            'hố đào',
            'hố sâu',
            'hố có nước',
            'chơi gần hố'
        ],
        response: "**Hố công trình có nước là khu vực rất nguy hiểm.**\n\n" +
                  "Hố có thể sâu hơn em tưởng, thành hố dễ sạt và nước thường đục nên không nhìn thấy đáy.\n\n" +
                  "Không được xuống chơi, đứng sát mép hoặc nhảy qua hố.\n\n" +
                  "Nếu thấy hố sâu không có rào chắn hay biển cảnh báo, em hãy tránh xa và báo cho người lớn."
    },

    {
        id: "sand_pit_water_risk",
        keywords: [
            'hố lấy cát',
            'ho lay cat',
            'hố cát có nước',
            'khai thác cát',
            'hố cát sâu',
            'bơi hố cát'
        ],
        response: "**Hố lấy cát có thể rất sâu và nguy hiểm.**\n\n" +
                  "Việc đào, khai thác cát có thể tạo ra chỗ nước sâu bất ngờ hoặc vùng nước xoáy.\n\n" +
                  "Em tuyệt đối không được xuống tắm, bơi hoặc chơi quanh các hố lấy cát.\n\n" +
                  "Dù mặt nước nhìn yên, bên dưới vẫn có thể có địa hình rất nguy hiểm."
    },

    {
        id: "soil_pit_water_risk",
        keywords: [
            'hố lấy đất',
            'ho lay dat',
            'hố đất có nước',
            'hố đào đất',
            'hố đất sâu',
            'chơi hố đất'
        ],
        response: "**Hố lấy đất sau khi mưa hoặc để lâu có thể biến thành một vùng nước sâu.**\n\n" +
                  "Bờ hố thường dốc, trơn và có thể sạt khiến người đứng gần bị rơi xuống.\n\n" +
                  "Em không nên chơi, leo trèo hoặc đứng sát mép hố.\n\n" +
                  "Nếu khu vực không có rào chắn, hãy tránh xa và báo người lớn."
    },

    {
        id: "irrigation_water_hole_risk",
        keywords: [
            'hố tưới',
            'hố chứa nước tưới',
            'ho tuoi',
            'nước tưới ruộng',
            'hố nước ruộng',
            'hố tưới cây'
        ],
        response: "**Hố chứa nước để tưới cây hoặc tưới ruộng cũng có thể gây đuối nước.**\n\n" +
                  "Những hố này thường nằm ngoài đồng hoặc vườn, có thể khá sâu và không có rào chắn.\n\n" +
                  "Em không nên đến gần, nghịch nước hoặc xuống lấy đồ khi không có người lớn.\n\n" +
                  "Hãy coi mọi hố nước sâu là khu vực nguy hiểm."
    },

    {
        id: "fish_pond_public_risk",
        keywords: [
            'ao nuôi cá',
            'ao ca',
            'ao cá nguy hiểm',
            'xuống ao cá',
            'bắt cá ao',
            'chơi ao cá'
        ],
        response: "**Ao nuôi cá không phải là nơi vui chơi hoặc bơi lội.**\n\n" +
                  "Ao có thể sâu, bờ trơn và đáy nhiều bùn khiến em rất khó đứng vững nếu rơi xuống.\n\n" +
                  "Không được tự ý xuống ao bắt cá, lội nước hay lấy đồ vật.\n\n" +
                  "Nếu cần làm việc ở ao cá, phải có người lớn hướng dẫn và bảo đảm an toàn."
    },

    {
        id: "open_drain_risk",
        keywords: [
            'cống không nắp',
            'cong khong nap',
            'cống hở',
            'hố ga hở',
            'cống thoát nước',
            'miệng cống',
            'cống nguy hiểm'
        ],
        response: "**Cống hoặc hố ga không có nắp rất nguy hiểm.**\n\n" +
                  "Khi trời mưa hoặc nước ngập, em có thể không nhìn thấy miệng cống và dễ bị rơi xuống.\n\n" +
                  "Em không nên đứng gần, bước qua hoặc chơi cạnh cống bị mất nắp.\n\n" +
                  "Nếu phát hiện cống hở, hãy tránh xa và báo ngay cho người lớn."
    },

    {
        id: "electric_pole_hole_risk",
        keywords: [
            'hố cột điện',
            'ho cot dien',
            'hố chôn cột',
            'hố cột có nước',
            'hố điện',
            'hố chưa lấp'
        ],
        response: "**Hố đào để chôn cột điện nếu chưa được lấp hoặc che chắn có thể gây tai nạn.**\n\n" +
                  "Sau mưa, hố có thể đầy nước khiến chúng ta không biết được độ sâu thật sự.\n\n" +
                  "Em không được đến gần, nhảy qua hoặc thò chân xuống thử.\n\n" +
                  "Hãy báo người lớn nếu thấy hố không có rào chắn."
    },

    {
        id: "no_warning_sign_water_area",
        keywords: [
            'không biển cảnh báo',
            'khong bien canh bao',
            'không có biển cấm',
            'chỗ nước không có biển',
            'không biển thì an toàn không'
        ],
        response: "**Không có biển cảnh báo không có nghĩa là nơi đó an toàn.**\n\n" +
                  "Nhiều ao, hồ, hố nước hoặc kênh mương ngoài cộng đồng chưa được đặt biển cảnh báo dù vẫn có nguy cơ rất cao.\n\n" +
                  "Vì vậy, em không nên tự xuống nước chỉ vì không nhìn thấy biển cấm.\n\n" +
                  "Nếu không biết rõ độ sâu và mức độ an toàn, hãy tránh xa và hỏi người lớn."
    },

    {
        id: "no_fence_water_area",
        keywords: [
            'không rào chắn',
            'khong rao chan',
            'ao không có rào',
            'hố không rào',
            'không có hàng rào',
            'nơi nước không chắn'
        ],
        response: "**Khu vực có nước mà không có hàng rào chắn cần được coi là nơi nguy hiểm.**\n\n" +
                  "Trẻ em có thể vô tình chạy đến quá gần, trượt chân hoặc rơi xuống nước.\n\n" +
                  "Em nên giữ khoảng cách, không đến sát mép và không rủ bạn chơi ở đó.\n\n" +
                  "Nếu thấy nguy cơ rõ ràng, hãy báo cho người lớn để có biện pháp che chắn."
    },

    {
        id: "muddy_marsh_area_risk",
        keywords: [
            'vùng sình lầy',
            'sinh lay',
            'bùn lầy',
            'chỗ bùn nước',
            'lội bùn',
            'nước bùn nguy hiểm'
        ],
        response: "**Vùng sình lầy và bùn nước rất dễ làm em bị mắc chân hoặc mất thăng bằng.**\n\n" +
                  "Có những chỗ nhìn tưởng nông nhưng thực tế lại sâu hoặc lún mạnh.\n\n" +
                  "Em không nên bước xuống để thử, bắt cá hoặc chơi đùa.\n\n" +
                  "Nếu lỡ sa vào vùng bùn hoặc nước nguy hiểm, hãy bình tĩnh gọi người lớn giúp đỡ."
    },

    {
        id: "play_ball_near_water",
        keywords: [
            'đá bóng gần sông',
            'da bong gan song',
            'đá bóng gần ao',
            'chơi bóng gần hồ',
            'bóng gần nước',
            'sân gần sông'
        ],
        response: "**Không nên đá bóng hoặc chơi các trò chạy nhảy sát ao, hồ, sông, suối.**\n\n" +
                  "Khi mải chạy theo bóng, em có thể không để ý mép nước và bị trượt chân.\n\n" +
                  "Nếu bóng rơi xuống nước, tuyệt đối không tự xuống lấy.\n\n" +
                  "Hãy gọi người lớn hoặc bỏ lại quả bóng nếu việc lấy bóng không an toàn."
    },

    {
        id: "toy_falls_into_public_water",
        keywords: [
            'đồ rơi xuống ao',
            'do roi xuong nuoc',
            'bóng rơi xuống sông',
            'dép rơi xuống hồ',
            'đồ chơi rơi xuống nước',
            'xuống lấy đồ'
        ],
        response: "**Nếu đồ vật rơi xuống ao, hồ, sông hoặc hố nước, em không được tự xuống lấy.**\n\n" +
                  "Khi cố với hoặc xuống nước lấy đồ, em có thể bị trượt chân hoặc rơi vào chỗ sâu.\n\n" +
                  "Hãy đứng ở nơi an toàn và gọi người lớn giúp đỡ.\n\n" +
                  "Một món đồ có thể thay thế được, còn sự an toàn của em thì không."
    },

    {
        id: "after_school_water_play",
        keywords: [
            'tan học ra ao',
            'tan hoc di tam',
            'nghỉ học đi bơi',
            'sau giờ học đi tắm',
            'trốn đi bơi',
            'tan trường ra sông'
        ],
        response: "**Sau giờ học, em không nên tự rủ bạn ra ao, hồ, sông, suối để tắm hoặc chơi.**\n\n" +
                  "Đây là lúc người lớn có thể không biết các em đang ở đâu nên nếu xảy ra sự cố sẽ rất khó hỗ trợ kịp thời.\n\n" +
                  "Sau khi tan học, hãy về nhà đúng giờ hoặc tham gia hoạt động đã được gia đình cho phép.\n\n" +
                  "Nếu muốn đi bơi, cần báo gia đình và có người lớn giám sát."
    },

    {
        id: "holiday_water_play",
        keywords: [
            'nghỉ hè đi tắm',
            'nghi he di boi',
            'ngày nghỉ ra sông',
            'nghỉ học ra hồ',
            'hè đi tắm sông',
            'ngày nghỉ đi bơi'
        ],
        response: "**Nghỉ hè là lúc em có nhiều thời gian vui chơi nhưng cũng cần đặc biệt chú ý an toàn dưới nước.**\n\n" +
                  "Không tự rủ bạn đi tắm sông, hồ hoặc ao khi không có người lớn đi cùng.\n\n" +
                  "Nếu muốn đi bơi, hãy chọn nơi được phép, báo cho gia đình và có người lớn hoặc nhân viên cứu hộ giám sát.\n\n" +
                  "Vui hè an toàn mới là một mùa hè thật vui."
    },

    {
        id: "dangerous_area_what_to_do",
        keywords: [
            'gặp chỗ nguy hiểm',
            'gap cho nguy hiem',
            'thấy hố nước',
            'thấy ao nguy hiểm',
            'phải làm gì khi thấy nguy hiểm',
            'nơi nguy hiểm báo ai'
        ],
        response: "**Khi phát hiện khu vực có nguy cơ đuối nước, em hãy nhớ 3 việc:**\n\n" +
                  "1. **Tránh xa** khu vực đó.\n" +
                  "2. **Cảnh báo bạn bè và em nhỏ** không đến gần.\n" +
                  "3. **Báo cho người lớn** như bố mẹ, thầy cô hoặc người có trách nhiệm.\n\n" +
                  "Em không nên tự xuống kiểm tra hoặc tự sửa hàng rào, nắp cống hay biển cảnh báo."
    },

    {
        id: "community_water_safety_summary",
        keywords: [
            'an toàn ngoài cộng đồng',
            'phòng đuối nước ngoài đường',
            'phong duoi nuoc cong dong',
            'đi chơi cần tránh gì',
            'chơi ngoài trời gần nước'
        ],
        response: "**Khi vui chơi ngoài cộng đồng, em hãy nhớ:**\n\n" +
                  "✅ Tránh xa ao, hồ, sông, suối, kênh, mương và hố nước sâu.\n" +
                  "✅ Không đến sát khu vực không có rào chắn.\n" +
                  "✅ Không tự xuống nước lấy bóng hoặc đồ chơi.\n" +
                  "✅ Không rủ nhau đi tắm sau giờ học hoặc ngày nghỉ.\n" +
                  "✅ Báo người lớn khi thấy cống hở, hố nước hoặc khu vực nguy hiểm.\n\n" +
                  "Quy tắc dễ nhớ là: **Không lại gần – Không tự xuống – Báo người lớn.**"
    },
{
        id: "water_transport_safety_general",
        keywords: [
            'đi thuyền an toàn',
            'đi đò cần chú ý gì',
            'di tau an toan',
            'đi ghe cần làm gì',
            'an toàn đường thủy',
            'đi tàu phải làm gì'
        ],
        response: "**Khi đi tàu, thuyền, ghe hoặc đò, em cần tuân thủ các quy tắc an toàn.**\n\n" +
                  "Em phải mặc áo phao, lên xuống phương tiện theo hướng dẫn, ngồi đúng chỗ và không chạy nhảy, đùa nghịch.\n\n" +
                  "Trước khi đi, cần quan sát xem phương tiện có áo phao hoặc dụng cụ cứu sinh hay không và không nên lên phương tiện chở quá đông người.\n\n" +
                  "Nếu xảy ra sự cố, hãy giữ bình tĩnh và làm đúng hướng dẫn của người điều khiển phương tiện."
    },

    {
        id: "life_jacket_on_boat",
        keywords: [
            'đi thuyền có cần áo phao',
            'đi đò mặc áo phao',
            'ao phao khi di tau',
            'đi ghe cần áo phao không',
            'có phải mặc áo phao không',
            'trên tàu mặc áo phao'
        ],
        response: "**Có. Khi tham gia giao thông đường thủy, em cần mặc áo phao.**\n\n" +
                  "Áo phao giúp cơ thể nổi tốt hơn nếu không may bị rơi xuống nước hoặc phương tiện gặp sự cố.\n\n" +
                  "Em cần mặc áo phao đúng cách, cài dây chắc chắn và sử dụng loại phù hợp với cơ thể.\n\n" +
                  "Không nên tháo áo phao ra chỉ vì cảm thấy nóng hoặc bất tiện."
    },

    {
        id: "life_jacket_correct_size",
        keywords: [
            'áo phao phải vừa không',
            'ao phao dung co',
            'áo phao quá rộng',
            'áo phao quá chật',
            'chọn áo phao',
            'mặc áo phao thế nào'
        ],
        response: "**Áo phao cần vừa với cơ thể và được mặc đúng cách.**\n\n" +
                  "Nếu áo quá rộng, áo có thể tuột khỏi người khi xuống nước. Nếu quá chật, em sẽ khó vận động.\n\n" +
                  "Hãy cài đầy đủ dây và khóa theo hướng dẫn của người lớn hoặc nhân viên phụ trách.\n\n" +
                  "Trước khi phương tiện rời bến, em nên kiểm tra áo phao đã được mặc chắc chắn chưa."
    },

    {
        id: "boat_no_life_jacket",
        keywords: [
            'thuyền không có áo phao',
            'đò không có phao',
            'khong co ao phao',
            'tàu thiếu phao',
            'không có dụng cụ cứu sinh'
        ],
        response: "**Nếu phương tiện không có áo phao hoặc dụng cụ cứu sinh, em không nên lên.**\n\n" +
                  "Áo phao và các dụng cụ nổi là những thiết bị rất quan trọng để bảo vệ hành khách khi xảy ra sự cố.\n\n" +
                  "Em hãy báo cho người lớn đi cùng hoặc người phụ trách và chỉ tham gia khi điều kiện an toàn được bảo đảm."
    },

    {
        id: "overloaded_boat_risk",
        keywords: [
            'thuyền quá đông',
            'đò chở quá người',
            'tau qua tai',
            'đò đông người',
            'ghe quá tải',
            'thuyền chở quá tải'
        ],
        response: "**Không nên đi phương tiện đường thủy đang chở quá số người quy định.**\n\n" +
                  "Khi quá đông người, tàu, thuyền, ghe hoặc đò dễ mất cân bằng, tròng trành, chìm hoặc lật hơn.\n\n" +
                  "Đặc biệt với thuyền hoặc đò nhỏ, nguy cơ này càng cao.\n\n" +
                  "Nếu thấy phương tiện quá đông, em hãy báo cho người lớn và chờ phương tiện an toàn hơn."
    },

    {
        id: "bad_weather_boat",
        keywords: [
            'mưa có nên đi thuyền',
            'giông bão đi tàu',
            'troi xau di do',
            'gió lớn đi thuyền',
            'mưa to đi đò',
            'thời tiết xấu đi tàu'
        ],
        response: "**Không nên đi tàu, thuyền, ghe hoặc đò khi thời tiết xấu.**\n\n" +
                  "Mưa to, gió lớn, giông hoặc bão có thể làm sóng mạnh, phương tiện khó điều khiển và dễ xảy ra tai nạn.\n\n" +
                  "Nếu thời tiết đang xấu hoặc sắp chuyển xấu, em hãy chờ ở nơi an toàn và làm theo hướng dẫn của người lớn."
    },

    {
        id: "boarding_boat_safely",
        keywords: [
            'lên thuyền thế nào',
            'lên đò an toàn',
            'len tau nhu the nao',
            'lên ghe cần làm gì',
            'cách lên thuyền'
        ],
        response: "**Khi lên tàu, thuyền, ghe hoặc đò, em cần xếp hàng và đi theo hướng dẫn.**\n\n" +
                  "Không chen lấn, xô đẩy hoặc nhảy lên phương tiện.\n\n" +
                  "Đi chậm, giữ thăng bằng và bước theo vị trí được người phụ trách hướng dẫn.\n\n" +
                  "Sau khi lên phương tiện, hãy nhanh chóng ngồi đúng chỗ."
    },

    {
        id: "getting_off_boat_safely",
        keywords: [
            'xuống thuyền thế nào',
            'xuống đò an toàn',
            'xuong tau nhu the nao',
            'rời thuyền',
            'cách xuống ghe'
        ],
        response: "**Khi xuống phương tiện, em cũng cần xếp hàng và chờ đến lượt.**\n\n" +
                  "Không chen lấn, nhảy từ trên tàu xuống bờ hoặc tự ý xuống khi phương tiện chưa ổn định.\n\n" +
                  "Hãy làm theo hướng dẫn của người điều khiển hoặc nhân viên trên phương tiện để tránh bị trượt ngã."
    },

    {
        id: "do_not_board_from_side",
        keywords: [
            'lên từ mạn thuyền',
            'xuống từ mạn thuyền',
            'man thuyen',
            'leo bên hông thuyền',
            'nhảy từ mạn đò'
        ],
        response: "**Không nên tự ý lên hoặc xuống từ mạn thuyền.**\n\n" +
                  "Việc leo lên hoặc xuống ở bên hông có thể làm thuyền tròng trành và khiến em mất thăng bằng, rơi xuống nước.\n\n" +
                  "Hãy sử dụng đúng lối lên xuống và làm theo chỉ dẫn của người phụ trách."
    },

    {
        id: "queue_when_boarding_boat",
        keywords: [
            'chen lấn khi lên đò',
            'xô đẩy lên thuyền',
            'chen lan len tau',
            'có được chen nhau lên tàu không',
            'xếp hàng lên đò'
        ],
        response: "**Không được chen lấn hoặc xô đẩy khi lên xuống phương tiện đường thủy.**\n\n" +
                  "Nhiều người dồn về một phía có thể làm thuyền hoặc đò mất cân bằng.\n\n" +
                  "Em hãy xếp hàng, chờ đến lượt và di chuyển từ từ theo hướng dẫn."
    },

    {
        id: "secure_belongings_before_boat",
        keywords: [
            'dây giày khi đi thuyền',
            'cặp sách khi đi đò',
            'do dac khi len tau',
            'mũ nón đi thuyền',
            'đồ dùng khi lên đò'
        ],
        response: "**Trước khi lên xuống phương tiện, em nên giữ đồ dùng thật gọn gàng.**\n\n" +
                  "Hãy buộc dây giày, chỉnh quai mũ, cặp sách và các vật dụng để không bị vướng khi di chuyển.\n\n" +
                  "Đồ cồng kềnh hoặc dây bị lỏng có thể khiến em vấp ngã hoặc mất thăng bằng."
    },

    {
        id: "sit_in_assigned_seat_boat",
        keywords: [
            'ngồi đâu trên thuyền',
            'ngồi đúng chỗ',
            'ngoi tren tau',
            'đi đò ngồi thế nào',
            'chỗ ngồi trên ghe'
        ],
        response: "**Khi ở trên tàu, thuyền, ghe hoặc đò, em cần ngồi đúng vị trí được hướng dẫn.**\n\n" +
                  "Không tự ý đổi chỗ, tụ tập về một phía hoặc đứng lên khi phương tiện đang chạy.\n\n" +
                  "Ngồi đúng chỗ giúp phương tiện giữ cân bằng và an toàn hơn cho tất cả mọi người."
    },

    {
        id: "do_not_walk_on_moving_boat",
        keywords: [
            'đi lại trên thuyền',
            'đứng lên trên đò',
            'di lai tren tau',
            'đi lại khi tàu chạy',
            'chạy trên thuyền'
        ],
        response: "**Không nên đi lại hoặc chạy nhảy khi phương tiện đang di chuyển.**\n\n" +
                  "Việc di chuyển nhiều có thể làm tàu, thuyền hoặc đò bị tròng trành và khiến em dễ ngã.\n\n" +
                  "Trừ khi thật sự cần thiết và có hướng dẫn, em nên ngồi yên tại chỗ."
    },

    {
        id: "do_not_play_on_boat",
        keywords: [
            'đùa trên thuyền',
            'choi tren tau',
            'chạy nhảy trên đò',
            'xô đẩy trên thuyền',
            'nghịch trên tàu'
        ],
        response: "**Không được đùa nghịch, chạy nhảy hoặc xô đẩy trên phương tiện đường thủy.**\n\n" +
                  "Một cú xô nhẹ cũng có thể khiến bạn mất thăng bằng và rơi xuống nước.\n\n" +
                  "Khi ở trên tàu hoặc thuyền, em cần giữ trật tự và ngồi đúng chỗ để bảo đảm an toàn."
    },

    {
        id: "do_not_put_hands_feet_in_water",
        keywords: [
            'thò tay xuống nước',
            'thò chân xuống nước',
            'tho tay xuong nuoc',
            'ngâm chân khi đi thuyền',
            'chạm nước khi tàu chạy'
        ],
        response: "**Không được thò tay hoặc chân xuống nước khi tàu, thuyền đang di chuyển.**\n\n" +
                  "Em có thể bị va vào vật bên ngoài, bị nước kéo mất thăng bằng hoặc rơi khỏi phương tiện.\n\n" +
                  "Hãy ngồi gọn trong phương tiện và giữ tay chân ở vị trí an toàn."
    },

    {
        id: "do_not_lean_out_boat",
        keywords: [
            'thò đầu ra ngoài tàu',
            'tho dau ra ngoai',
            'thò người ra ngoài',
            'ngó ra ngoài tàu',
            'lean ra ngoài thuyền'
        ],
        response: "**Không nên thò đầu, tay, chân hoặc người ra ngoài phương tiện.**\n\n" +
                  "Các vật bên ngoài có thể va vào em hoặc em có thể mất thăng bằng.\n\n" +
                  "Trên tàu lớn, em cũng không nên thò đầu hoặc tay ra ngoài cửa sổ."
    },

    {
        id: "do_not_take_photos_dangerously_boat",
        keywords: [
            'chụp ảnh trên thuyền',
            'tạo dáng trên tàu',
            'chup anh tren do',
            'selfie trên thuyền',
            'đứng chụp ảnh trên tàu'
        ],
        response: "**Không nên đứng lên, tạo dáng hoặc di chuyển nguy hiểm để chụp ảnh trên tàu, thuyền.**\n\n" +
                  "Việc mải chụp ảnh có thể làm em mất tập trung, trượt chân hoặc rơi xuống nước.\n\n" +
                  "Nếu muốn chụp ảnh, hãy ngồi hoặc đứng ở vị trí an toàn và làm theo hướng dẫn của người lớn."
    },

    {
        id: "do_not_touch_boat_equipment",
        keywords: [
            'nghịch thiết bị trên tàu',
            'chạm máy trên tàu',
            'nghich thiet bi tau',
            'bấm nút trên tàu',
            'có được nghịch đồ trên thuyền'
        ],
        response: "**Không được tự ý nghịch các thiết bị trên tàu hoặc thuyền.**\n\n" +
                  "Một số thiết bị có liên quan đến việc điều khiển và bảo đảm an toàn của phương tiện.\n\n" +
                  "Tự ý chạm, kéo hoặc bấm có thể gây nguy hiểm cho em và những người xung quanh."
    },

    {
        id: "remember_lifesaving_equipment_location",
        keywords: [
            'phao cứu sinh ở đâu',
            'nhớ vị trí phao',
            'vi tri phao cuu sinh',
            'dụng cụ cứu sinh trên tàu',
            'trên tàu cần quan sát gì'
        ],
        response: "**Khi lên phương tiện, em nên chú ý vị trí đặt áo phao, phao cứu sinh và các dụng cụ nổi.**\n\n" +
                  "Biết chúng ở đâu sẽ giúp em và người lớn xử lý nhanh hơn nếu có sự cố.\n\n" +
                  "Tuy nhiên, em không nên tự ý lấy ra nghịch khi chưa cần thiết."
    },

    {
        id: "boat_accident_what_to_do",
        keywords: [
            'tàu gặp sự cố',
            'thuyền gặp nạn',
            'tau bi su co',
            'đò gặp sự cố',
            'thuyền sắp lật',
            'gặp nạn trên tàu'
        ],
        response: "**Nếu phương tiện gặp sự cố, điều đầu tiên là phải bình tĩnh.**\n\n" +
                  "Em không nên la hét, chạy nhảy hoặc tự ý làm theo ý mình.\n\n" +
                  "Hãy mặc hoặc giữ chắc áo phao và làm đúng hướng dẫn của người điều khiển hoặc nhân viên trên phương tiện.\n\n" +
                  "Chỉ rời phương tiện khi được hướng dẫn."
    },

    {
        id: "stay_calm_boat_emergency",
        keywords: [
            'tàu gặp nạn có nên hoảng',
            'binh tinh tren tau',
            'sự cố trên thuyền phải làm gì',
            'hoảng loạn trên tàu',
            'gặp sự cố phải bình tĩnh'
        ],
        response: "**Khi xảy ra sự cố trên tàu hoặc thuyền, em cần cố gắng giữ bình tĩnh.**\n\n" +
                  "Hoảng loạn, chạy nhảy hoặc chen lấn có thể làm tình hình nguy hiểm hơn.\n\n" +
                  "Hãy lắng nghe người điều khiển phương tiện, giữ áo phao chắc chắn và thực hiện từng hướng dẫn một."
    },

    {
        id: "do_not_jump_off_boat_emergency",
        keywords: [
            'tàu gặp nạn có nên nhảy xuống',
            'nhay khoi tau',
            'có được tự nhảy khỏi thuyền',
            'thuyền sự cố nhảy xuống nước',
            'rời tàu khi nào'
        ],
        response: "**Không được tự ý nhảy khỏi tàu hoặc thuyền khi xảy ra sự cố.**\n\n" +
                  "Tự nhảy xuống nước có thể khiến em rơi vào dòng nước mạnh hoặc làm việc cứu hộ khó khăn hơn.\n\n" +
                  "Theo tài liệu, em chỉ nên rời phương tiện khi có thông báo và hướng dẫn của người phụ trách."
    },

    {
        id: "boat_fire_emergency",
        keywords: [
            'cháy trên tàu',
            'tau bi chay',
            'hỏa hoạn trên thuyền',
            'cháy tàu phải làm gì'
        ],
        response: "**Nếu có cháy trên tàu, em phải giữ bình tĩnh và làm đúng hướng dẫn của nhân viên trên tàu.**\n\n" +
                  "Không tự chạy lung tung hoặc chen lấn. Hãy di chuyển theo lối thoát và hướng dẫn được đưa ra.\n\n" +
                  "Tài liệu cũng lưu ý rằng trong tình huống khẩn cấp, hành khách chỉ nên rời tàu theo thông báo và hướng dẫn của người phụ trách."
    },

    {
        id: "water_transport_safety_summary",
        keywords: [
            'nhớ gì khi đi thuyền',
            'quy tắc đi đò',
            'quy tac di tau',
            'an toàn đi ghe',
            'tóm tắt đi thuyền an toàn'
        ],
        response: "**Khi đi tàu, thuyền, ghe hoặc đò, em hãy nhớ:**\n\n" +
                  "✅ Mặc áo phao.\n" +
                  "✅ Không đi phương tiện quá tải hoặc thiếu dụng cụ cứu sinh.\n" +
                  "✅ Lên xuống theo hướng dẫn, không chen lấn.\n" +
                  "✅ Ngồi đúng chỗ, không chạy nhảy hoặc đùa nghịch.\n" +
                  "✅ Không thò tay, chân hoặc người ra ngoài.\n" +
                  "✅ Khi có sự cố, bình tĩnh và làm theo hướng dẫn.\n\n" +
                  "Một câu dễ nhớ là: **Mặc phao – Ngồi yên – Nghe hướng dẫn.**"
    },
{
        id: "swimming_safety_general",
        keywords: [
            'đi bơi an toàn',
            'boi an toan',
            'đi bơi cần gì',
            'bơi cần chú ý',
            'an toàn khi bơi',
            'học bơi an toàn'
        ],
        response: "**Để đi bơi an toàn, em cần nhớ một số điều quan trọng:**\n\n" +
                  "1. Chỉ bơi ở nơi được phép và có người lớn giám sát.\n" +
                  "2. Khởi động trước khi xuống nước.\n" +
                  "3. Không bơi khi đang mệt, lạnh hoặc sức khỏe không tốt.\n" +
                  "4. Không tự ý bơi xa, bơi vào vùng nước sâu hoặc nơi lạ.\n" +
                  "5. Nếu thấy mệt hoặc đuối sức, hãy dừng bơi và tìm cách ra nơi an toàn.\n\n" +
                  "Biết bơi là tốt, nhưng biết giữ an toàn còn quan trọng hơn."
    },

    {
        id: "learn_swimming_importance",
        keywords: [
            'có nên học bơi',
            'hoc boi co tot khong',
            'vì sao phải học bơi',
            'học bơi để làm gì',
            'học bơi có cần không'
        ],
        response: "**Học bơi là một kỹ năng rất cần thiết.**\n\n" +
                  "Học bơi giúp em làm quen với môi trường nước, biết cách giữ cơ thể nổi và xử lý tốt hơn khi gặp tình huống bất ngờ.\n\n" +
                  "Tuy nhiên, học bơi không chỉ là học bơi nhanh hay bơi xa. Em còn cần học cách đứng nước, nổi ngửa, tự cứu và nhận biết nơi nguy hiểm.\n\n" +
                  "Hãy học bơi với giáo viên hoặc người hướng dẫn có chuyên môn."
    },

    {
        id: "learn_swimming_with_teacher",
        keywords: [
            'học bơi với ai',
            'ai dạy bơi',
            'hoc boi voi ai',
            'tự học bơi được không',
            'ai hướng dẫn bơi'
        ],
        response: "**Em nên học bơi với giáo viên hoặc người hướng dẫn có khả năng quản lý và bảo đảm an toàn.**\n\n" +
                  "Người hướng dẫn sẽ giúp em học đúng kỹ thuật, biết cách xuống nước an toàn và xử lý khi gặp sự cố.\n\n" +
                  "Không nên tự học bơi một mình ở ao, hồ, sông hoặc nơi không có người giám sát."
    },

    {
        id: "warm_up_before_swimming",
        keywords: [
            'khởi động trước khi bơi',
            'khoi dong truoc khi boi',
            'trước khi bơi làm gì',
            'có cần khởi động',
            'xuống nước ngay được không'
        ],
        response: "**Trước khi bơi, em cần khởi động.**\n\n" +
                  "Khởi động giúp các khớp và cơ bắp linh hoạt hơn, giảm nguy cơ chấn thương và chuột rút.\n\n" +
                  "Em nên thực hiện các động tác theo hướng dẫn của giáo viên hoặc người phụ trách trước khi xuống nước.\n\n" +
                  "Không nên đang ngồi nghỉ rồi bất ngờ nhảy ngay xuống nước."
    },

    {
        id: "safe_pool_entry",
        keywords: [
            'xuống bể thế nào',
            'xuong be an toan',
            'cách xuống hồ bơi',
            'xuống nước an toàn',
            'vào bể bơi'
        ],
        response: "**Khi xuống bể bơi, em cần làm theo hướng dẫn của giáo viên hoặc người phụ trách.**\n\n" +
                  "Không chạy lấy đà rồi nhảy xuống nước khi chưa được phép.\n\n" +
                  "Hãy xuống từ vị trí an toàn, giữ chắc tay vịn hoặc thành bể nếu có và quan sát độ sâu trước khi xuống."
    },

    {
        id: "safe_pool_exit",
        keywords: [
            'lên khỏi bể',
            'ra khỏi hồ bơi',
            'len khoi be',
            'lên bờ thế nào',
            'ra khỏi nước'
        ],
        response: "**Khi ra khỏi bể, em nên lên ở vị trí có thang hoặc nơi được hướng dẫn.**\n\n" +
                  "Không chen lấn, trèo lên ở chỗ trơn hoặc kéo bạn khác xuống nước.\n\n" +
                  "Nếu đang mệt, hãy báo người lớn và lên khỏi nước từ từ, an toàn."
    },

    {
        id: "swim_only_with_supervision",
        keywords: [
            'bơi cần người lớn',
            'boi co can nguoi lon',
            'ai phải trông khi bơi',
            'bơi một mình được không',
            'đi bơi không người lớn'
        ],
        response: "**Trẻ em không nên bơi khi không có người lớn giám sát.**\n\n" +
                  "Ngay cả khi em đã biết bơi, vẫn có thể gặp tình huống bất ngờ như mệt, chuột rút, sặc nước hoặc đi vào vùng nước sâu.\n\n" +
                  "Người lớn hoặc nhân viên cứu hộ có thể phát hiện và hỗ trợ nhanh hơn khi có sự cố."
    },

    {
        id: "known_swimmer_still_at_risk",
        keywords: [
            'biết bơi vẫn đuối nước',
            'biet boi van nguy hiem',
            'bơi giỏi vẫn đuối',
            'biết bơi có an toàn không',
            'bơi giỏi có sao không'
        ],
        response: "**Biết bơi vẫn có thể gặp đuối nước.**\n\n" +
                  "Một người biết bơi có thể vẫn gặp nguy hiểm nếu bị chuột rút, mệt quá sức, gặp sóng lớn, nước xoáy hoặc bơi ở nơi lạ.\n\n" +
                  "Nếu chưa được học kỹ năng tự cứu và thoát hiểm, khi gặp sự cố em có thể hoảng sợ và xử lý sai.\n\n" +
                  "Vì vậy, biết bơi không có nghĩa là được chủ quan."
    },

    {
        id: "pool_vs_natural_water",
        keywords: [
            'bể bơi với sông khác gì',
            'boi be va song',
            'bơi hồ khác bể bơi',
            'bơi ngoài tự nhiên',
            'bơi sông khác hồ bơi'
        ],
        response: "**Bơi ở bể bơi và bơi ở sông, hồ, biển rất khác nhau.**\n\n" +
                  "Bể bơi thường có độ sâu rõ ràng, thành bể để bám và có người quản lý.\n\n" +
                  "Trong khi đó, sông, hồ hoặc biển có thể có chỗ sâu bất ngờ, nước lạnh hơn, dòng chảy mạnh, nước xoáy hoặc vật cản dưới nước.\n\n" +
                  "Vì vậy, bơi tốt ở bể không có nghĩa là em an toàn khi bơi ở mọi nơi."
    },

    {
        id: "unfamiliar_water_risk",
        keywords: [
            'bơi chỗ lạ',
            'boi noi la',
            'hồ lạ có nên bơi',
            'xuống nước chỗ lạ',
            'nơi chưa từng bơi'
        ],
        response: "**Không nên tự ý bơi ở nơi lạ.**\n\n" +
                  "Em có thể không biết độ sâu, dòng chảy, nhiệt độ nước hoặc vật cản bên dưới.\n\n" +
                  "Một nơi trông có vẻ bình thường vẫn có thể có vùng nước sâu hoặc nước xoáy.\n\n" +
                  "Chỉ xuống nước khi nơi đó được phép và có người lớn hướng dẫn."
    },

    {
        id: "deep_water_swimming_risk",
        keywords: [
            'bơi chỗ sâu',
            'nuoc sau',
            'bơi vùng nước sâu',
            'chỗ sâu có bơi được không',
            'bơi ra chỗ sâu'
        ],
        response: "**Trẻ em không nên tự ý bơi vào vùng nước sâu.**\n\n" +
                  "Khi xuống chỗ sâu, em không còn chạm chân xuống đáy và dễ hoảng sợ nếu bị mệt hoặc sặc nước.\n\n" +
                  "Đặc biệt ở sông, hồ và biển, độ sâu có thể thay đổi rất nhanh.\n\n" +
                  "Hãy ở đúng khu vực được người lớn hoặc giáo viên cho phép."
    },

    {
        id: "swimming_tired_action",
        keywords: [
            'bơi mệt',
            'boi bi met',
            'đuối sức khi bơi',
            'mệt dưới nước',
            'đang bơi hết sức'
        ],
        response: "**Nếu đang bơi mà thấy mệt hoặc đuối sức, em không được cố bơi tiếp.**\n\n" +
                  "Hãy giữ bình tĩnh, gọi người lớn hoặc nhân viên cứu hộ và tìm cách đến nơi có thể bám chắc.\n\n" +
                  "Nếu đã được học kỹ năng nổi ngửa, em có thể dùng kỹ năng này để nghỉ và giữ sức.\n\n" +
                  "Sau đó từ từ ra khỏi nước."
    },

    {
        id: "swimming_cold_action",
        keywords: [
            'bơi thấy lạnh',
            'lanh khi boi',
            'run khi bơi',
            'nước lạnh',
            'đang bơi bị rét'
        ],
        response: "**Nếu đang bơi mà thấy lạnh hoặc run, em nên ra khỏi nước.**\n\n" +
                  "Cảm giác lạnh có thể là dấu hiệu cơ thể đang mệt và mất sức.\n\n" +
                  "Không nên cố bơi tiếp chỉ vì muốn chơi thêm.\n\n" +
                  "Hãy báo người lớn và lên bờ để nghỉ ngơi, giữ ấm."
    },

    {
        id: "floating_on_back_skill",
        keywords: [
            'nổi ngửa là gì',
            'noi ngua',
            'nổi ngửa để làm gì',
            'cách nghỉ khi bơi',
            'nổi trên lưng'
        ],
        response: "**Nổi ngửa là một kỹ năng an toàn rất quan trọng khi ở dưới nước.**\n\n" +
                  "Kỹ năng này giúp em giữ mặt, mũi và miệng trên mặt nước, nghỉ ngơi và tiết kiệm sức.\n\n" +
                  "Nổi ngửa cũng có thể giúp em bình tĩnh hơn khi bị mệt.\n\n" +
                  "Em nên học và thực hành kỹ năng này dưới sự hướng dẫn của giáo viên."
    },

    {
        id: "treading_water_skill",
        keywords: [
            'đứng nước là gì',
            'dung nuoc',
            'đứng nước để làm gì',
            'giữ đầu trên mặt nước',
            'kỹ năng đứng nước'
        ],
        response: "**Đứng nước là kỹ năng giúp em giữ cơ thể ở tư thế gần thẳng đứng và giữ đầu trên mặt nước.**\n\n" +
                  "Kỹ năng này giúp em thở, quan sát xung quanh và chờ sự hỗ trợ khi cần.\n\n" +
                  "Đây là một trong những kỹ năng sinh tồn rất quan trọng khi học bơi.\n\n" +
                  "Em nên tập đứng nước trong lớp học bơi có người hướng dẫn."
    },

    {
        id: "water_survival_skills",
        keywords: [
            'kỹ năng sinh tồn dưới nước',
            'ky nang sinh ton',
            'kỹ năng tự cứu',
            'tu cuu duoi nuoc',
            'cần học gì ngoài bơi'
        ],
        response: "**Ngoài các kiểu bơi, em còn cần học kỹ năng sinh tồn trong nước.**\n\n" +
                  "Một số kỹ năng quan trọng gồm: đứng nước, nổi ngửa, xoay chuyển tư thế cơ thể và xử lý khi bất ngờ rơi xuống nước.\n\n" +
                  "Những kỹ năng này giúp em bình tĩnh hơn và có thêm thời gian chờ người khác hỗ trợ.\n\n" +
                  "Hãy học từng bước dưới sự hướng dẫn của giáo viên."
    },

    {
        id: "self_rescue_skill_importance",
        keywords: [
            'tự cứu là gì',
            'tu cuu la gi',
            'kỹ năng tự cứu để làm gì',
            'tự cứu khi rơi xuống nước',
            'học tự cứu'
        ],
        response: "**Kỹ năng tự cứu giúp em bảo vệ mình khi gặp tình huống bất ngờ dưới nước.**\n\n" +
                  "Ví dụ, khi bất ngờ rơi xuống nước, nếu đã được học nổi ngửa, đứng nước và đổi tư thế cơ thể, em sẽ ít hoảng loạn hơn.\n\n" +
                  "Mục tiêu là giữ được đường thở trên mặt nước, tiết kiệm sức và chờ hỗ trợ."
    },

    {
        id: "body_position_change_skill",
        keywords: [
            'đổi tư thế dưới nước',
            'xoay người dưới nước',
            'doi tu the khi boi',
            'từ sấp sang ngửa',
            'xoay sang nổi ngửa'
        ],
        response: "**Biết đổi tư thế dưới nước là một kỹ năng rất hữu ích.**\n\n" +
                  "Em có thể học cách chuyển từ nằm sấp sang nằm ngửa, từ nổi sang đứng nước và ngược lại.\n\n" +
                  "Kỹ năng này giúp em xử lý tốt hơn khi gặp vật cản, sóng lớn hoặc bất ngờ rơi xuống nước.\n\n" +
                  "Hãy luyện tập trong lớp học bơi an toàn."
    },

    {
        id: "do_not_dive_headfirst_unknown_water",
        keywords: [
            'cắm đầu xuống nước',
            'nhay cam dau',
            'lao đầu xuống hồ',
            'nhảy đầu xuống bể',
            'nhảy cắm đầu nguy hiểm'
        ],
        response: "**Không được nhảy cắm đầu xuống nơi chưa biết rõ độ sâu.**\n\n" +
                  "Nếu nước nông hoặc có vật cứng bên dưới, em có thể bị chấn thương nặng ở đầu, cổ hoặc lưng.\n\n" +
                  "Chỉ thực hiện động tác nhảy xuống nước khi có người hướng dẫn và ở nơi được phép."
    },

    {
        id: "do_not_swim_race_unsupervised",
        keywords: [
            'bơi thi',
            'thi boi',
            'thách bơi',
            'bơi đua với bạn',
            'bơi xa với bạn'
        ],
        response: "**Không nên tự tổ chức bơi thi hoặc thách nhau bơi xa.**\n\n" +
                  "Khi cố thắng bạn, em có thể bơi quá sức và không nhận ra mình đang đi vào nơi nguy hiểm.\n\n" +
                  "Nếu muốn thi bơi, hãy tham gia hoạt động có giáo viên hoặc người phụ trách tổ chức."
    },

    {
        id: "no_eating_while_swimming",
        keywords: [
            'ăn khi bơi',
            'an trong luc boi',
            'vừa bơi vừa ăn',
            'ăn dưới nước',
            'đang bơi ăn được không'
        ],
        response: "**Không nên ăn uống trong lúc đang bơi.**\n\n" +
                  "Việc này có thể làm em mất tập trung và dễ bị sặc.\n\n" +
                  "Nếu muốn ăn hoặc uống, hãy ra khỏi nước và nghỉ ở nơi an toàn."
    },

    {
        id: "no_swimming_after_full_meal",
        keywords: [
            'ăn no rồi bơi',
            'an no di boi',
            'vừa ăn xong đi bơi',
            'ăn cơm xong bơi',
            'no bụng có bơi được không'
        ],
        response: "**Không nên đi bơi ngay sau khi vừa ăn quá no.**\n\n" +
                  "Cơ thể cần thời gian để tiêu hóa thức ăn. Vận động mạnh ngay sau khi ăn có thể làm em khó chịu, buồn nôn hoặc mệt.\n\n" +
                  "Hãy nghỉ ngơi và chỉ xuống nước khi cơ thể cảm thấy thoải mái."
    },

    {
        id: "swimming_class_content",
        keywords: [
            'học bơi học gì',
            'hoc boi gom gi',
            'lớp bơi dạy gì',
            'học bơi có những gì',
            'nội dung học bơi'
        ],
        response: "**Một lớp học bơi an toàn không chỉ dạy các kiểu bơi.**\n\n" +
                  "Theo tài liệu, học sinh còn được học kiến thức phòng tránh đuối nước, khởi động, lên xuống bể an toàn, làm quen với nước, đứng nước, nổi sấp, nổi ngửa và kỹ năng tự cứu.\n\n" +
                  "Ở các mức phù hợp, các em còn được học thêm kỹ năng cứu đuối an toàn."
    },

    {
        id: "swimming_safety_summary",
        keywords: [
            'nhớ gì khi đi bơi',
            'quy tắc đi bơi',
            'quy tac boi',
            'tóm tắt an toàn bơi',
            'đi bơi nhớ gì'
        ],
        response: "**Khi đi bơi, em hãy nhớ:**\n\n" +
                  "✅ Khởi động trước khi xuống nước.\n" +
                  "✅ Chỉ bơi khi có người lớn giám sát.\n" +
                  "✅ Không bơi ở nơi lạ, nước sâu hoặc nguy hiểm.\n" +
                  "✅ Không bơi thi, nhảy cắm đầu hoặc cố bơi khi đã mệt.\n" +
                  "✅ Học thêm kỹ năng nổi ngửa, đứng nước và tự cứu.\n\n" +
                  "Một câu dễ nhớ là: **Khởi động – Đúng nơi – Có người trông – Mệt thì dừng.**"
    },
 {
        id: "swimming_cramp_definition",
        keywords: [
            'chuột rút là gì',
            'chuot rut la gi',
            'co rút khi bơi',
            'đang bơi bị co cơ',
            'bị chuột rút'
        ],
        response: "**Chuột rút là hiện tượng cơ bị co thắt đột ngột, gây đau và làm cho việc cử động trở nên khó khăn.**\n\n" +
                  "Chuột rút thường xảy ra ở cẳng chân, đùi, bàn chân, bàn tay hoặc cơ bụng.\n\n" +
                  "Khi đang ở trên bờ, chuột rút thường không quá nguy hiểm. Nhưng nếu xảy ra lúc đang bơi thì em có thể khó cử động, nhanh mất sức và có nguy cơ đuối nước.\n\n" +
                  "Vì vậy, khi bị chuột rút dưới nước, điều quan trọng nhất là **bình tĩnh và tìm cách giữ cơ thể nổi**."
    },

    {
        id: "swimming_cramp_causes",
        keywords: [
            'vì sao bị chuột rút',
            'nguyên nhân chuột rút',
            'tai sao chuot rut',
            'bơi bị chuột rút vì sao',
            'co cơ do đâu'
        ],
        response: "**Chuột rút khi bơi có thể xảy ra vì nhiều nguyên nhân.**\n\n" +
                  "Một số nguyên nhân thường gặp là cơ thể mệt, vận động quá sức, khởi động chưa kỹ, bơi quá lâu hoặc cơ thể bị mất nước.\n\n" +
                  "Nước lạnh và việc cố gắng bơi quá sức cũng có thể làm nguy cơ chuột rút tăng lên.\n\n" +
                  "Vì vậy, em nên khởi động kỹ, bơi vừa sức và không xuống nước khi đang mệt."
    },

    {
        id: "cramp_while_swimming_first_action",
        keywords: [
            'đang bơi bị chuột rút',
            'chuot rut khi boi',
            'bị co chân dưới nước',
            'bơi bị chuột rút làm gì',
            'đang bơi đau chân'
        ],
        response: "**Nếu đang bơi mà bị chuột rút, việc đầu tiên là phải bình tĩnh.**\n\n" +
                  "Em không nên hoảng sợ hoặc cố vùng vẫy mạnh vì sẽ làm cơ thể nhanh mất sức hơn.\n\n" +
                  "Hãy gọi người xung quanh giúp đỡ, cố giữ cơ thể nổi và tìm vị trí có thể bám vào như thành bể, dây phao hoặc vật chắc chắn.\n\n" +
                  "Nếu đã học kỹ năng nổi ngửa hoặc đứng nước, hãy sử dụng để nghỉ và giữ sức."
    },

    {
        id: "do_not_struggle_cramp",
        keywords: [
            'chuột rút có được vùng vẫy không',
            'khong vung vay',
            'vùng vẫy khi chuột rút',
            'co chân có nên đạp mạnh',
            'bị chuột rút có nên cố bơi'
        ],
        response: "**Không nên vùng vẫy mạnh khi bị chuột rút.**\n\n" +
                  "Càng vùng vẫy, em càng tiêu tốn nhiều sức và dễ bị sặc nước.\n\n" +
                  "Đau do chuột rút cũng có thể khiến em hoảng loạn nếu cố cử động quá mạnh.\n\n" +
                  "Hãy bình tĩnh, thả lỏng cơ thể, cố giữ nổi và gọi người giúp đỡ."
    },

    {
        id: "call_for_help_cramp",
        keywords: [
            'chuột rút có kêu cứu không',
            'keu cuu khi chuot rut',
            'bị chuột rút gọi ai',
            'đau chân dưới nước gọi cứu',
            'bơi bị co chân phải gọi ai'
        ],
        response: "**Có. Khi bị chuột rút dưới nước, em nên tìm cách báo cho người xung quanh biết ngay.**\n\n" +
                  "Hãy hô cứu hoặc giơ tay ra hiệu nếu vẫn có thể giữ thăng bằng và nổi an toàn.\n\n" +
                  "Nếu ở gần thành bể, phao hoặc vị trí có thể bám, hãy di chuyển đến đó để chờ người lớn hoặc nhân viên cứu hộ hỗ trợ."
    },

    {
        id: "float_back_when_cramp",
        keywords: [
            'nổi ngửa khi chuột rút',
            'noi ngua chuot rut',
            'chuột rút có nổi ngửa không',
            'bị co chân thì nổi thế nào',
            'nổi ngửa để nghỉ'
        ],
        response: "**Nổi ngửa có thể giúp em tiết kiệm sức khi bị chuột rút.**\n\n" +
                  "Khi nổi ngửa đúng cách, mặt, mũi và miệng được giữ trên mặt nước nên em có thể thở và bình tĩnh hơn.\n\n" +
                  "Hãy thả lỏng cơ thể, cử động nhẹ nhàng và gọi người giúp đỡ.\n\n" +
                  "Kỹ năng này cần được học và tập trước với giáo viên, không nên tự tập ở nơi nguy hiểm."
    },

    {
        id: "treading_water_when_cramp",
        keywords: [
            'đứng nước khi chuột rút',
            'dung nuoc chuot rut',
            'co chân đứng nước được không',
            'đứng nước để nghỉ',
            'chuột rút đứng nước'
        ],
        response: "**Đứng nước cũng có thể giúp em giữ đầu trên mặt nước và tiết kiệm sức.**\n\n" +
                  "Khi đứng nước, tay và chân cử động nhẹ để giữ mũi, miệng ở trên mặt nước.\n\n" +
                  "Điều quan trọng là thở chậm, giữ bình tĩnh và không cố dùng phần cơ đang bị đau quá nhiều.\n\n" +
                  "Nếu thấy không an toàn, hãy gọi cứu hộ ngay."
    },

    {
        id: "finger_cramp_swimming",
        keywords: [
            'chuột rút ngón tay',
            'co ngón tay khi bơi',
            'chuot rut ngon tay',
            'đang bơi co bàn tay'
        ],
        response: "**Nếu bị chuột rút ở ngón tay, em cần giữ bình tĩnh và ưu tiên giữ cơ thể nổi.**\n\n" +
                  "Theo tài liệu, có thể nắm chặt bàn tay rồi xòe mạnh các ngón ra vài lần để giúp cơ thư giãn.\n\n" +
                  "Tuy nhiên, khi đang ở dưới nước, an toàn vẫn quan trọng nhất: nếu thấy khó giữ nổi, hãy gọi người lớn hoặc nhân viên cứu hộ ngay."
    },

    {
        id: "arm_cramp_swimming",
        keywords: [
            'chuột rút cánh tay',
            'co tay khi bơi',
            'chuot rut canh tay',
            'đau tay khi đang bơi'
        ],
        response: "**Nếu bị chuột rút ở cánh tay, hãy bình tĩnh và cố giữ cơ thể nổi.**\n\n" +
                  "Theo tài liệu, có thể gập và duỗi cánh tay để giúp cơ đang co được thả lỏng.\n\n" +
                  "Không nên cố bơi thật nhanh bằng cánh tay đang đau.\n\n" +
                  "Hãy gọi hỗ trợ và tìm cách đến thành bể, phao hoặc vị trí an toàn."
    },

    {
        id: "leg_cramp_swimming",
        keywords: [
            'chuột rút chân',
            'co chân khi bơi',
            'chuot rut chan',
            'đau bắp chân dưới nước',
            'bơi bị cứng chân'
        ],
        response: "**Chuột rút ở chân là tình huống rất dễ làm người đang bơi hoảng sợ.**\n\n" +
                  "Em cần dừng việc đạp chân mạnh, bình tĩnh giữ nổi và gọi người giúp đỡ.\n\n" +
                  "Nếu đã được hướng dẫn kỹ năng xử lý chuột rút, em có thể nhẹ nhàng kéo giãn phần chân bị co.\n\n" +
                  "Sau khi lên bờ, hãy nghỉ ngơi và không tiếp tục bơi ngay."
    },

    {
        id: "thigh_cramp_swimming",
        keywords: [
            'chuột rút đùi',
            'co đùi khi bơi',
            'chuot rut dui',
            'đau đùi dưới nước'
        ],
        response: "**Khi bị chuột rút ở đùi, em cần ưu tiên giữ an toàn trước.**\n\n" +
                  "Hãy bình tĩnh, giữ nổi và gọi trợ giúp.\n\n" +
                  "Nếu em đã được giáo viên hướng dẫn cách kéo giãn cơ, có thể thực hiện nhẹ nhàng khi vẫn giữ được cơ thể an toàn trên mặt nước.\n\n" +
                  "Không cố bơi nhanh bằng chân đang đau."
    },

    {
        id: "abdominal_cramp_swimming",
        keywords: [
            'chuột rút bụng',
            'co bụng khi bơi',
            'chuot rut bung',
            'đau bụng khi đang bơi'
        ],
        response: "**Chuột rút ở bụng tuy ít gặp hơn nhưng vẫn có thể rất nguy hiểm khi đang bơi.**\n\n" +
                  "Hãy giữ bình tĩnh, cố nổi hoặc đứng nước và gọi người hỗ trợ.\n\n" +
                  "Theo tài liệu, người bị chuột rút bụng có thể thả lỏng, hít thở nhẹ nhàng và tìm cách làm giãn cơ.\n\n" +
                  "Sau khi lên được bờ, nên nghỉ ngơi và không tiếp tục bơi."
    },

    {
        id: "cramp_move_to_safe_place",
        keywords: [
            'chuột rút bám vào đâu',
            'bị co chân tìm chỗ bám',
            'tim cho bam khi chuot rut',
            'chuột rút vào bờ thế nào'
        ],
        response: "**Khi bị chuột rút, hãy quan sát xem gần đó có nơi nào có thể bám chắc hay không.**\n\n" +
                  "Ví dụ: thành bể, dây phao hoặc vật nổi chắc chắn.\n\n" +
                  "Nếu có thể di chuyển an toàn, hãy từ từ tiến đến đó thay vì cố bơi thật nhanh.\n\n" +
                  "Nếu không thể tự di chuyển, hãy giữ nổi và tiếp tục gọi người giúp đỡ."
    },

    {
        id: "after_cramp_reaches_shore",
        keywords: [
            'lên bờ sau chuột rút',
            'sau chuột rút làm gì',
            'sau khi co chân',
            'len bo chuot rut',
            'chuột rút hết rồi bơi tiếp'
        ],
        response: "**Sau khi lên bờ vì bị chuột rút, em nên nghỉ ngơi và không tiếp tục bơi ngay.**\n\n" +
                  "Có thể nhẹ nhàng xoa bóp phần cơ bị đau và giữ ấm cơ thể.\n\n" +
                  "Nếu vẫn còn đau nhiều, chóng mặt hoặc mệt, hãy báo ngay cho người lớn.\n\n" +
                  "Tài liệu cũng khuyến cáo sau khi bị chuột rút nên tìm cách lên bờ và không tiếp tục bơi."
    },

    {
        id: "cramp_prevention_general",
        keywords: [
            'phòng chuột rút',
            'phong chuot rut',
            'làm sao không bị chuột rút',
            'tránh chuột rút khi bơi',
            'cách ngừa chuột rút'
        ],
        response: "**Để giảm nguy cơ chuột rút khi bơi, em nên:**\n\n" +
                  "✅ Khởi động kỹ trước khi xuống nước.\n" +
                  "✅ Không xuống nước khi đang mệt.\n" +
                  "✅ Bơi vừa sức, không cố bơi quá lâu hoặc quá xa.\n" +
                  "✅ Không ngâm mình quá lâu trong nước lạnh.\n" +
                  "✅ Dừng lại khi thấy cơ thể bắt đầu lạnh hoặc đuối sức.\n\n" +
                  "Chuột rút có thể xảy ra bất ngờ, vì vậy luôn cần có người lớn giám sát khi bơi."
    },

    {
        id: "warmup_prevent_cramp",
        keywords: [
            'khởi động tránh chuột rút',
            'khoi dong chuot rut',
            'không khởi động dễ co chân',
            'khởi động có giảm chuột rút không'
        ],
        response: "**Khởi động trước khi bơi giúp giảm nguy cơ chuột rút và chấn thương.**\n\n" +
                  "Các động tác khởi động làm nóng cơ thể và giúp cơ, khớp chuẩn bị cho việc vận động dưới nước.\n\n" +
                  "Em không nên bỏ qua bước này, đặc biệt khi nước lạnh.\n\n" +
                  "Hãy khởi động theo hướng dẫn của giáo viên hoặc người phụ trách."
    },

    {
        id: "do_not_swim_tired_cramp",
        keywords: [
            'mệt dễ chuột rút',
            'met co chuot rut khong',
            'mệt có nên bơi',
            'vận động mệt rồi bơi'
        ],
        response: "**Khi cơ thể đang mệt, nguy cơ chuột rút và đuối sức sẽ tăng lên.**\n\n" +
                  "Nếu em vừa chạy nhảy, vận động nhiều hoặc cảm thấy mệt, hãy nghỉ trước khi xuống nước.\n\n" +
                  "Không nên cố bơi chỉ vì bạn bè đang chơi hoặc vì muốn bơi thêm."
    },

    {
        id: "cold_water_cramp_risk",
        keywords: [
            'nước lạnh dễ chuột rút',
            'nuoc lanh chuot rut',
            'bơi nước lạnh',
            'lạnh có co chân không'
        ],
        response: "**Nước lạnh có thể làm cơ thể nhanh mệt và tăng nguy cơ chuột rút.**\n\n" +
                  "Nếu nước quá lạnh hoặc em bắt đầu run, lạnh và mất sức, hãy rời khỏi nước.\n\n" +
                  "Không nên ngâm mình quá lâu trong nước lạnh hoặc tiếp tục bơi khi cơ thể đã khó chịu."
    },

    {
        id: "swim_within_ability_cramp",
        keywords: [
            'bơi vừa sức',
            'boi vua suc',
            'bơi quá sức',
            'bơi lâu có sao không',
            'bơi xa dễ chuột rút'
        ],
        response: "**Em nên bơi vừa sức với khả năng của mình.**\n\n" +
                  "Bơi quá nhanh, quá lâu hoặc quá xa có thể làm cơ bắp mệt và tăng nguy cơ chuột rút.\n\n" +
                  "Nếu thấy tốc độ bơi chậm lại, người lạnh hoặc bắt đầu đuối sức, hãy nghỉ và ra khỏi nước."
    },

    {
        id: "cramp_safety_summary",
        keywords: [
            'nhớ gì khi chuột rút',
            'chuột rút xử lý sao',
            'quy tac chuot rut',
            'tóm tắt chuột rút khi bơi',
            'bị co chân phải nhớ gì'
        ],
        response: "**Nếu bị chuột rút khi đang bơi, hãy nhớ:**\n\n" +
                  "1. **Bình tĩnh.**\n" +
                  "2. **Không vùng vẫy mạnh.**\n" +
                  "3. **Giữ cơ thể nổi** bằng nổi ngửa hoặc đứng nước nếu đã được học.\n" +
                  "4. **Kêu cứu và tìm chỗ bám an toàn.**\n" +
                  "5. **Lên bờ và nghỉ ngơi**, không tiếp tục bơi ngay.\n\n" +
                  "Câu dễ nhớ: **Bình tĩnh – Giữ nổi – Gọi cứu – Lên bờ.**"
    },
 {
        id: "rip_current_definition",
        keywords: [
            'dòng chảy xa bờ là gì',
            'dòng rút xa bờ',
            'dong chay xa bo',
            'dòng rip',
            'nước kéo ra biển',
            'dòng nước ra xa bờ'
        ],
        response: "**Dòng chảy rút xa bờ là một dòng nước mạnh chảy từ bờ ra phía biển.**\n\n" +
                  "Dòng nước này có thể kéo người đang tắm hoặc bơi ra xa bờ rất nhanh.\n\n" +
                  "Điều nguy hiểm là khu vực có dòng chảy xa bờ đôi khi lại nhìn khá yên, ít sóng nên nhiều người tưởng đó là nơi an toàn.\n\n" +
                  "Vì vậy, khi đi biển em cần quan sát kỹ và chỉ tắm ở khu vực được phép, có người lớn và nhân viên cứu hộ."
    },

    {
        id: "rip_current_danger",
        keywords: [
            'dòng xa bờ có nguy hiểm không',
            'rip current nguy hiểm',
            'dong xa bo nguy hiem',
            'bị nước kéo ra xa',
            'dòng nước kéo người'
        ],
        response: "**Dòng chảy xa bờ rất nguy hiểm vì có thể kéo người ra xa bờ nhanh hơn khả năng bơi vào.**\n\n" +
                  "Nếu cố bơi ngược dòng, người bơi rất dễ mất sức và hoảng loạn.\n\n" +
                  "Dòng này có thể xuất hiện ở khu vực tưởng như yên tĩnh và cũng có thể thay đổi vị trí.\n\n" +
                  "Vì vậy, điều quan trọng là biết nhận diện, tránh xa và không cố chống lại dòng nước."
    },

    {
        id: "rip_current_calm_water_danger",
        keywords: [
            'nước lặng ở biển',
            'bien lang co an toan',
            'chỗ ít sóng',
            'chỗ biển yên',
            'nước yên có nguy hiểm',
            'vùng lặng sóng'
        ],
        response: "**Ở biển, chỗ nước lặng chưa chắc đã an toàn.**\n\n" +
                  "Một vùng ít sóng, mặt nước phẳng hơn khu vực xung quanh có thể là nơi xuất hiện dòng chảy rút xa bờ.\n\n" +
                  "Dòng này có thể kéo người ra xa bờ dù bên ngoài trông rất yên.\n\n" +
                  "Vì vậy, em không nên tự chọn chỗ tắm chỉ vì thấy ít sóng. Hãy theo biển báo và hướng dẫn của nhân viên cứu hộ."
    },

    {
        id: "rip_current_signs",
        keywords: [
            'nhận biết dòng xa bờ',
            'dau hieu dong xa bo',
            'dòng rip nhìn thế nào',
            'biết chỗ có dòng xa bờ',
            'dấu hiệu rip current'
        ],
        response: "**Một số dấu hiệu có thể giúp nhận biết dòng chảy xa bờ:**\n\n" +
                  "1. Mặt nước ở một khu vực **phẳng và ít sóng hơn** vùng xung quanh.\n" +
                  "2. Màu nước có thể **sẫm hoặc đục hơn**.\n" +
                  "3. Có thể thấy bọt nước hoặc vật nổi bị cuốn từ bờ ra biển.\n\n" +
                  "Tuy nhiên, học sinh không nên tự mình phán đoán rồi xuống thử. Hãy hỏi người lớn hoặc nhân viên cứu hộ trước khi xuống biển."
    },

    {
        id: "rip_current_dark_water",
        keywords: [
            'nước biển sẫm màu',
            'nuoc sam mau o bien',
            'nước biển đục hơn',
            'vùng nước tối màu',
            'màu nước khác'
        ],
        response: "**Một vùng nước có màu sẫm hoặc đục hơn khu vực xung quanh có thể là dấu hiệu của dòng chảy xa bờ.**\n\n" +
                  "Nguyên nhân là độ sâu, dòng chảy và cát, bọt nước trong khu vực đó có thể khác những nơi bên cạnh.\n\n" +
                  "Nếu thấy dấu hiệu bất thường, em không nên xuống nước và hãy hỏi người lớn hoặc nhân viên cứu hộ."
    },

    {
        id: "rip_current_debris_sign",
        keywords: [
            'bọt nước trôi ra biển',
            'rac troi ra xa bo',
            'vật nổi bị kéo ra',
            'bọt bị cuốn ra xa',
            'đồ nổi trôi ra biển'
        ],
        response: "**Nếu thấy bọt nước hoặc các vật nổi bị cuốn từ bờ ra phía biển, đó có thể là dấu hiệu của dòng chảy xa bờ.**\n\n" +
                  "Em nên tránh xa khu vực đó và báo cho người lớn hoặc nhân viên cứu hộ.\n\n" +
                  "Không nên xuống nước để thử xem dòng chảy có mạnh hay không."
    },

    {
        id: "rip_current_before_swimming",
        keywords: [
            'trước khi tắm biển làm gì',
            'truoc khi xuong bien',
            'kiểm tra biển trước khi bơi',
            'xuống biển cần xem gì',
            'tắm biển cần quan sát gì'
        ],
        response: "**Trước khi xuống biển, em nên quan sát khu vực định tắm và hỏi người lớn hoặc nhân viên cứu hộ.**\n\n" +
                  "Hãy chú ý biển báo, cờ cảnh báo, khu vực được phép tắm và những nơi có dấu hiệu dòng chảy xa bờ.\n\n" +
                  "Không xuống nước nếu thời tiết xấu hoặc khu vực không có người lớn giám sát."
    },

    {
        id: "rip_current_ask_lifeguard",
        keywords: [
            'hỏi cứu hộ trước khi bơi',
            'hoi nhan vien cuu ho',
            'nhân viên cứu hộ biển',
            'hỏi chỗ tắm an toàn',
            'ai chỉ chỗ tắm biển'
        ],
        response: "**Nhân viên cứu hộ là người em nên hỏi khi không biết khu vực nào an toàn để tắm biển.**\n\n" +
                  "Họ có thể biết nơi nào có dòng chảy nguy hiểm, khu vực nào được phép tắm và thời điểm nào không nên xuống nước.\n\n" +
                  "Nếu không có nhân viên cứu hộ, em càng cần ở gần người lớn và không tự ý xuống nước."
    },

    {
        id: "rip_current_caught_first_action",
        keywords: [
            'bị dòng xa bờ',
            'bi dong keo ra bien',
            'bị kéo ra xa bờ',
            'gặp dòng rip',
            'bị nước kéo đi'
        ],
        response: "**Nếu bị dòng chảy xa bờ kéo đi, việc đầu tiên là phải giữ bình tĩnh.**\n\n" +
                  "Hãy kêu cứu và cố giữ cơ thể nổi.\n\n" +
                  "Tuyệt đối không cố bơi thẳng ngược dòng vào bờ vì sẽ rất nhanh mất sức.\n\n" +
                  "Nếu đã được học kỹ năng phù hợp, hãy tìm cách bơi song song hoặc hơi chéo với bờ để thoát ra khỏi dòng chảy rồi mới hướng dần vào bờ."
    },

    {
        id: "rip_current_do_not_swim_against",
        keywords: [
            'bơi ngược dòng',
            'boi nguoc dong',
            'có nên bơi thẳng vào bờ',
            'bị kéo ra biển bơi vào bờ',
            'chống dòng xa bờ'
        ],
        response: "**Không nên bơi ngược trực tiếp dòng chảy xa bờ.**\n\n" +
                  "Dòng nước có thể mạnh hơn sức bơi của con người. Cố bơi ngược dòng sẽ làm em nhanh kiệt sức.\n\n" +
                  "Hãy bình tĩnh, giữ nổi và tìm cách di chuyển ra khỏi vùng dòng chảy theo hướng song song hoặc hơi chéo với bờ."
    },

    {
        id: "rip_current_swim_parallel",
        keywords: [
            'bơi song song bờ',
            'boi song song bo',
            'thoát dòng xa bờ hướng nào',
            'bơi ngang bờ',
            'ra khỏi dòng rip'
        ],
        response: "**Khi bị dòng xa bờ cuốn, một cách thoát là bơi song song hoặc hơi chéo với bờ để ra khỏi vùng dòng chảy.**\n\n" +
                  "Dòng chảy thường chỉ hoạt động mạnh trong một vùng tương đối hẹp.\n\n" +
                  "Sau khi thoát khỏi dòng, em mới từ từ bơi về phía bờ.\n\n" +
                  "Nếu quá mệt, hãy ưu tiên giữ nổi, kêu cứu và chờ hỗ trợ."
    },

    {
        id: "rip_current_too_tired",
        keywords: [
            'bị dòng kéo mà mệt',
            'met trong dong xa bo',
            'không bơi nổi khi bị kéo',
            'đuối sức ngoài biển',
            'bị kéo ra xa hết sức'
        ],
        response: "**Nếu bị dòng chảy xa bờ kéo đi và em đã quá mệt, đừng cố bơi mạnh.**\n\n" +
                  "Hãy thả lỏng, cố giữ cơ thể nổi hoặc đứng nước nếu em đã được học kỹ năng này.\n\n" +
                  "Tiếp tục kêu cứu và tiết kiệm sức cho đến khi dòng yếu hơn hoặc có người hỗ trợ."
    },

    {
        id: "rip_current_float_and_wait",
        keywords: [
            'nổi khi bị kéo ra biển',
            'noi khi dong xa bo',
            'giữ nổi ngoài biển',
            'bị rip thì nổi',
            'đứng nước khi dòng kéo'
        ],
        response: "**Giữ cơ thể nổi là cách quan trọng để tiết kiệm sức khi bị dòng chảy xa bờ kéo đi.**\n\n" +
                  "Nếu em không thể bơi thoát ngay, hãy thả lỏng và thực hiện kỹ năng nổi ngửa hoặc đứng nước nếu đã được học.\n\n" +
                  "Khi dòng yếu hơn, mới tìm cách di chuyển ra khỏi vùng nguy hiểm và hướng về bờ."
    },

    {
        id: "rip_current_call_for_help",
        keywords: [
            'kêu cứu khi bị kéo',
            'keu cuu ngoai bien',
            'bị dòng kéo gọi ai',
            'ra hiệu cứu hộ',
            'bị cuốn ra biển'
        ],
        response: "**Khi bị dòng nước kéo ra xa bờ, hãy kêu cứu càng sớm càng tốt.**\n\n" +
                  "Em có thể hô lớn, ra hiệu bằng tay khi vẫn giữ được cơ thể nổi an toàn và cố gắng hướng về phía nhân viên cứu hộ hoặc người lớn.\n\n" +
                  "Không nên đợi đến lúc đã kiệt sức mới kêu cứu."
    },

    {
        id: "rip_current_rescue_friend",
        keywords: [
            'bạn bị dòng kéo',
            'ban bi keo ra bien',
            'cứu bạn dòng xa bờ',
            'bạn bị rip',
            'thấy người bị cuốn'
        ],
        response: "**Nếu thấy bạn bị dòng chảy xa bờ cuốn đi, em không được tự bơi ra cứu.**\n\n" +
                  "Em hãy gọi thật to để báo người lớn hoặc nhân viên cứu hộ.\n\n" +
                  "Nếu có phao hoặc vật nổi phù hợp và có thể đưa hoặc ném từ nơi an toàn, hãy sử dụng để hỗ trợ người gặp nạn.\n\n" +
                  "Không tự xuống nước vì em cũng có thể bị dòng chảy cuốn theo."
    },

    {
        id: "rip_current_throw_float",
        keywords: [
            'ném phao cho người bị cuốn',
            'nem phao dong xa bo',
            'dùng dây cứu ngoài biển',
            'quăng phao cứu',
            'vật nổi cứu người'
        ],
        response: "**Nếu có người bị dòng chảy xa bờ cuốn, có thể hỗ trợ từ nơi an toàn bằng phao hoặc vật nổi.**\n\n" +
                  "Hãy gọi người lớn, nhân viên cứu hộ và ném phao hoặc dây khi có điều kiện phù hợp.\n\n" +
                  "Trẻ em không nên tự bơi ra cứu trực tiếp."
    },

    {
        id: "rip_current_safe_beach",
        keywords: [
            'tắm biển ở đâu an toàn',
            'bai bien an toan',
            'chỗ nào được tắm biển',
            'biển có cứu hộ',
            'nơi tắm biển an toàn'
        ],
        response: "**Nơi an toàn hơn để tắm biển là khu vực được phép, có người lớn giám sát và có nhân viên cứu hộ.**\n\n" +
                  "Em cần tuân thủ biển báo, cờ cảnh báo và không tự ý đi ra ngoài khu vực được cho phép.\n\n" +
                  "Ngay cả khi biết bơi, em vẫn không nên bơi một mình hoặc bơi quá xa bờ."
    },

    {
        id: "rip_current_children_beach_rules",
        keywords: [
            'trẻ em tắm biển',
            'tre em di bien',
            'đi biển cần nhớ gì',
            'tắm biển an toàn',
            'bé đi biển'
        ],
        response: "**Khi tắm biển, em hãy nhớ:**\n\n" +
                  "✅ Luôn có người lớn đi cùng và giám sát.\n" +
                  "✅ Chỉ tắm ở khu vực được phép.\n" +
                  "✅ Quan sát biển báo và nghe nhân viên cứu hộ.\n" +
                  "✅ Không bơi một mình hoặc quá xa bờ.\n" +
                  "✅ Tránh khu vực có dấu hiệu dòng chảy xa bờ.\n\n" +
                  "Nếu chưa chắc nơi nào an toàn, đừng xuống nước."
    },

    {
        id: "rip_current_summary",
        keywords: [
            'nhớ gì về dòng xa bờ',
            'quy tac dong xa bo',
            'tóm tắt dòng rip',
            'thoát dòng xa bờ',
            'dòng xa bờ làm sao'
        ],
        response: "**Nếu gặp dòng chảy xa bờ, hãy nhớ:**\n\n" +
                  "1. **Bình tĩnh và kêu cứu.**\n" +
                  "2. **Không bơi ngược dòng.**\n" +
                  "3. **Giữ cơ thể nổi để tiết kiệm sức.**\n" +
                  "4. Nếu có khả năng, **bơi song song hoặc hơi chéo với bờ để thoát ra khỏi dòng.**\n" +
                  "5. Sau khi thoát, mới từ từ bơi vào bờ.\n\n" +
                  "Câu dễ nhớ: **Không chống dòng – Giữ nổi – Bơi ngang – Gọi cứu.**"
    },
{
        id: "water_whirlpool_definition",
        keywords: [
            'nước xoáy là gì',
            'xoáy nước',
            'nuoc xoay',
            'vùng nước xoáy',
            'dòng xoáy',
            'xoáy dưới nước'
        ],
        response: "**Nước xoáy là vùng nước chuyển động vòng tròn và có thể kéo người hoặc vật vào phía trong.**\n\n" +
                  "Nước xoáy có thể xuất hiện khi hai dòng nước chảy ngược chiều gặp nhau, ở khu vực chân thác, ghềnh nước hoặc nơi dưới đáy có địa hình đặc biệt.\n\n" +
                  "Một số vùng xoáy có lực hút rất mạnh nên cực kỳ nguy hiểm đối với người đang bơi.\n\n" +
                  "Vì vậy, khi thấy khu vực có nước xoáy hoặc dòng nước chuyển động bất thường, em phải tránh xa."
    },

    {
        id: "whirlpool_danger",
        keywords: [
            'nước xoáy có nguy hiểm không',
            'xoay nuoc nguy hiem',
            'xoáy nước có sao không',
            'bị nước xoáy',
            'dòng xoáy nguy hiểm'
        ],
        response: "**Nước xoáy rất nguy hiểm đối với người đang bơi.**\n\n" +
                  "Dòng xoáy có thể làm em mất thăng bằng, bị kéo khỏi vị trí an toàn hoặc làm em hoảng sợ và nhanh mất sức.\n\n" +
                  "Một số vùng xoáy còn có lực hút mạnh xuống phía dưới.\n\n" +
                  "Cách an toàn nhất là không tự ý bơi ở nơi có dấu hiệu nước xoáy."
    },

    {
        id: "whirlpool_locations",
        keywords: [
            'nước xoáy ở đâu',
            'noi co nuoc xoay',
            'chỗ nào dễ có xoáy',
            'xoáy thường ở đâu',
            'vùng nào có xoáy'
        ],
        response: "**Nước xoáy có thể xuất hiện ở nhiều vị trí khác nhau.**\n\n" +
                  "Theo tài liệu, em cần đặc biệt chú ý khu vực gần chân thác, ghềnh nước, nơi hai dòng nước gặp nhau, gần trụ cột hoặc tảng đá.\n\n" +
                  "Một số vùng xoáy còn có thể hình thành do địa hình đặc biệt dưới đáy sông.\n\n" +
                  "Không nên tự xuống nước để kiểm tra xem có xoáy hay không."
    },

    {
        id: "waterfall_whirlpool_risk",
        keywords: [
            'chân thác',
            'chan thac nuoc',
            'tắm gần thác',
            'bơi chân thác',
            'thác nước có xoáy'
        ],
        response: "**Không nên tắm hoặc bơi ngay gần chân thác nước.**\n\n" +
                  "Nước đổ mạnh xuống có thể tạo dòng chảy rối, dòng xiết và vùng xoáy khó nhận biết.\n\n" +
                  "Dù em biết bơi, những khu vực này vẫn có thể khiến em nhanh mất sức hoặc bị cuốn đi.\n\n" +
                  "Hãy đứng ở vị trí an toàn và tuân thủ biển cảnh báo."
    },

    {
        id: "rocks_pillars_whirlpool_risk",
        keywords: [
            'gần tảng đá',
            'gan tru cau',
            'gần trụ cột',
            'xoáy gần đá',
            'nước xoáy gần cầu'
        ],
        response: "**Khu vực gần tảng đá, trụ cầu hoặc trụ cột có thể xuất hiện dòng nước xoáy.**\n\n" +
                  "Khi nước chảy gặp vật cản, dòng nước có thể đổi hướng và tạo chuyển động bất thường.\n\n" +
                  "Vì vậy, em không nên bơi sát các trụ cầu, tảng đá hoặc công trình nằm trong dòng nước."
    },

    {
        id: "whirlpool_body_drop_sign",
        keywords: [
            'cảm giác bị sụt xuống',
            'bi sut xuong nuoc',
            'đang bơi bị hút xuống',
            'cơ thể bị kéo xuống',
            'bị tụt khi bơi'
        ],
        response: "**Nếu đang bơi mà cảm thấy cơ thể như bị sụt hoặc kéo xuống bất thường, đó có thể là dấu hiệu em đang gặp vùng nước xoáy.**\n\n" +
                  "Em cần cố giữ bình tĩnh, không hoảng loạn và tìm cách di chuyển ra khỏi vùng xoáy.\n\n" +
                  "Nếu có thể, hãy gọi người lớn hoặc nhân viên cứu hộ hỗ trợ."
    },

    {
        id: "whirlpool_first_action",
        keywords: [
            'gặp nước xoáy làm gì',
            'gap xoay nuoc',
            'bị xoáy phải làm sao',
            'rơi vào dòng xoáy',
            'xoáy nước xử lý sao'
        ],
        response: "**Khi gặp vùng nước xoáy, điều đầu tiên là phải bình tĩnh.**\n\n" +
                  "Không nên vùng vẫy hoặc bơi thẳng vào tâm xoáy.\n\n" +
                  "Theo tài liệu, cần quan sát hướng xoáy và tìm cách bơi ra phía ngoài vòng xoáy để thoát khỏi vùng nguy hiểm.\n\n" +
                  "Sau khi ra khỏi vùng xoáy, hãy tiết kiệm sức và di chuyển từ từ đến nơi an toàn."
    },

    {
        id: "whirlpool_spread_body",
        keywords: [
            'dang tay chân khi nước xoáy',
            'dang tay chan',
            'gặp xoáy nằm sấp',
            'xoáy nước nằm thế nào',
            'tư thế khi gặp xoáy'
        ],
        response: "**Theo tài liệu, khi đang bơi mà gặp vùng nước xoáy, cần bình tĩnh và có thể nằm sấp, dang rộng tay và chân.**\n\n" +
                  "Tư thế này giúp em chủ động hơn trước sự cuốn, hút của dòng nước.\n\n" +
                  "Sau đó cần tìm hướng di chuyển ra ngoài vùng xoáy thay vì bơi vào tâm."
    },

    {
        id: "whirlpool_escape_direction",
        keywords: [
            'thoát nước xoáy hướng nào',
            'boi huong nao khi xoay',
            'ra khỏi vòng xoáy',
            'bơi khỏi tâm xoáy',
            'hướng thoát xoáy'
        ],
        response: "**Khi gặp nước xoáy, không nên bơi vào tâm xoáy.**\n\n" +
                  "Theo tài liệu, cần bơi vòng theo hướng giúp em ra xa dần tâm xoáy và tìm cách vượt khỏi ảnh hưởng của dòng xoáy.\n\n" +
                  "Sau khi đã ra ngoài vùng xoáy, mới tập trung bơi đến nơi an toàn."
    },

    {
        id: "whirlpool_after_escape",
        keywords: [
            'thoát xoáy rồi làm gì',
            'sau khi thoat xoay',
            'ra khỏi nước xoáy',
            'thoát xoáy có bơi tiếp không'
        ],
        response: "**Sau khi thoát khỏi vùng nước xoáy, em cần tiết kiệm sức.**\n\n" +
                  "Theo tài liệu, có thể sử dụng bơi ếch hoặc đứng nước để hồi sức, chờ hỗ trợ hoặc từ từ di chuyển vào nơi an toàn.\n\n" +
                  "Không nên cố bơi thật nhanh nếu cơ thể đã mệt."
    },

    {
        id: "fast_current_definition",
        keywords: [
            'nước chảy xiết là gì',
            'dong chay xiet',
            'nước chảy mạnh',
            'dòng nước mạnh',
            'nước xiết'
        ],
        response: "**Nước chảy xiết là dòng nước di chuyển rất nhanh và mạnh.**\n\n" +
                  "Dòng nước này có thể làm người mất thăng bằng, bị cuốn đi và rất khó bơi ngược lại.\n\n" +
                  "Trẻ em tuyệt đối không nên xuống tắm, bơi hoặc lội qua nơi có nước chảy xiết."
    },

    {
        id: "fast_current_danger",
        keywords: [
            'nước xiết có nguy hiểm không',
            'nuoc chay manh nguy hiem',
            'dòng xiết có sao không',
            'bơi nước xiết',
            'lội nước chảy mạnh'
        ],
        response: "**Dòng nước chảy xiết rất nguy hiểm.**\n\n" +
                  "Ngay cả người biết bơi cũng có thể bị cuốn đi hoặc nhanh chóng mất sức.\n\n" +
                  "Vì vậy, em không được tự ý xuống nước khi thấy dòng chảy mạnh, đặc biệt ở sông, suối, khu vực mưa lũ hoặc gần thác."
    },

    {
        id: "do_not_swim_fast_current",
        keywords: [
            'bơi chỗ nước xiết',
            'boi nuoc chay xiet',
            'có được bơi nước mạnh không',
            'xuống dòng chảy xiết',
            'tắm chỗ nước mạnh'
        ],
        response: "**Không. Em không được bơi ở nơi có dòng nước chảy xiết.**\n\n" +
                  "Dòng nước mạnh có thể cuốn em khỏi vị trí an toàn rất nhanh.\n\n" +
                  "Ngay cả khi có người lớn ở gần hoặc em bơi giỏi, khu vực nước xiết vẫn có thể rất nguy hiểm."
    },

    {
        id: "friend_caught_whirlpool",
        keywords: [
            'bạn bị nước xoáy',
            'ban bi xoay nuoc',
            'bạn bị cuốn',
            'thấy người gặp xoáy',
            'cứu bạn nước xoáy'
        ],
        response: "**Nếu thấy bạn bị cuốn vào vùng nước xoáy, em không được tự nhảy xuống cứu.**\n\n" +
                  "Hãy lập tức gọi người lớn, nhân viên cứu hộ hoặc người có khả năng cứu hộ.\n\n" +
                  "Nếu có vật hỗ trợ phù hợp như phao, dây, gậy hoặc cành cây và em có thể sử dụng từ nơi an toàn, hãy đưa hoặc ném cho người gặp nạn.\n\n" +
                  "An toàn của người cứu phải được đặt lên trước."
    },

    {
        id: "friend_caught_fast_current",
        keywords: [
            'bạn bị nước xiết cuốn',
            'ban bi nuoc cuon',
            'cứu người dòng xiết',
            'người bị dòng mạnh cuốn',
            'bạn rơi vào nước mạnh'
        ],
        response: "**Nếu thấy người bị dòng nước xiết cuốn, trẻ em tuyệt đối không được tự nhảy xuống cứu.**\n\n" +
                  "Dòng nước có thể cuốn luôn cả người cứu.\n\n" +
                  "Hãy hô thật to, gọi người lớn hoặc lực lượng cứu hộ và tìm phao, dây hoặc vật nổi để hỗ trợ từ vị trí an toàn."
    },

    {
        id: "whirlpool_rescue_with_pole",
        keywords: [
            'dùng gậy cứu người',
            'dung gay cuu ban',
            'cành cây cứu người',
            'đưa sào cứu',
            'que dài cứu đuối'
        ],
        response: "**Có thể dùng gậy, sào hoặc cành cây để hỗ trợ người gặp nạn nếu em đang ở vị trí an toàn.**\n\n" +
                  "Hãy gọi người lớn trước, sau đó đưa đầu gậy hoặc cành cây về phía người gặp nạn để họ bám vào.\n\n" +
                  "Không đứng sát mép nước hoặc để người gặp nạn kéo em xuống.\n\n" +
                  "Nếu cảm thấy không an toàn, hãy thả vật hỗ trợ và lùi ra xa."
    },

    {
        id: "whirlpool_rescue_with_rope",
        keywords: [
            'dùng dây cứu người',
            'quang day cuu',
            'ném dây xuống nước',
            'dây cứu bạn',
            'dây cứu đuối'
        ],
        response: "**Nếu có dây và có thể sử dụng từ nơi an toàn, em có thể hỗ trợ bằng cách ném dây về phía người gặp nạn.**\n\n" +
                  "Tuy nhiên, em cần gọi người lớn hoặc cứu hộ càng sớm càng tốt.\n\n" +
                  "Không quấn dây quanh người mình hoặc đứng ở vị trí dễ bị kéo xuống nước."
    },

    {
        id: "whirlpool_rescue_with_clothes",
        keywords: [
            'dùng quần áo cứu người',
            'ao quan cuu duoi',
            'thắt lưng cứu người',
            'dùng áo kéo người',
            'vật nối cứu đuối'
        ],
        response: "**Trong tình huống khẩn cấp, có thể dùng quần áo, thắt lưng hoặc vật dài để hỗ trợ từ trên bờ nếu thật sự an toàn.**\n\n" +
                  "Mục đích là tạo một vật để người gặp nạn bám vào mà người cứu không phải xuống nước.\n\n" +
                  "Em vẫn cần gọi người lớn hoặc lực lượng cứu hộ ngay."
    },

    {
        id: "do_not_jump_into_whirlpool_rescue",
        keywords: [
            'nhảy xuống cứu người nước xoáy',
            'nhay xuong cuu ban',
            'có nên bơi ra cứu',
            'cứu trực tiếp dòng xiết',
            'lao xuống cứu người'
        ],
        response: "**Không. Trẻ em tuyệt đối không được tự nhảy xuống vùng nước xoáy hoặc dòng chảy xiết để cứu người.**\n\n" +
                  "Người cứu có thể bị cuốn theo và khiến tình huống trở nên nguy hiểm hơn.\n\n" +
                  "Cách đúng là **gọi cứu hộ – gọi người lớn – dùng vật hỗ trợ từ trên bờ nếu an toàn**."
    },

    {
        id: "whirlpool_call_rescue",
        keywords: [
            'gọi ai khi có người bị cuốn',
            'goi cuu ho',
            'ai cứu người nước xoáy',
            'báo ai khi có người gặp nạn',
            'gọi cứu nạn'
        ],
        response: "**Khi thấy người gặp nạn trong dòng nước xoáy hoặc nước xiết, hãy gọi người lớn và lực lượng cứu hộ ngay.**\n\n" +
                  "Nếu cần cấp cứu y tế, có thể gọi **115**. Trẻ em cũng nên ghi nhớ **111 – Tổng đài Quốc gia bảo vệ trẻ em**.\n\n" +
                  "Trong lúc chờ hỗ trợ, hãy đứng ở vị trí an toàn và chỉ dùng vật hỗ trợ nếu không làm mình gặp nguy hiểm."
    },

    {
        id: "whirlpool_safety_summary",
        keywords: [
            'nhớ gì về nước xoáy',
            'quy tac nuoc xoay',
            'tóm tắt nước xoáy',
            'gặp xoáy phải nhớ gì',
            'thoát xoáy'
        ],
        response: "**Khi gặp nước xoáy, em hãy nhớ:**\n\n" +
                  "1. **Bình tĩnh.**\n" +
                  "2. **Không bơi vào tâm xoáy.**\n" +
                  "3. **Tìm hướng ra ngoài vùng xoáy.**\n" +
                  "4. Sau khi thoát, **giữ sức và di chuyển đến nơi an toàn.**\n" +
                  "5. Nếu thấy người khác gặp nạn, **không tự nhảy xuống cứu.**\n\n" +
                  "Câu dễ nhớ: **Tránh xoáy – Không lao vào – Gọi cứu hộ.**"
    },
{
        id: "fall_into_water_general",
        keywords: [
            'rơi xuống nước',
            'roi xuong nuoc',
            'ngã xuống nước',
            'nga xuong nuoc',
            'rớt xuống hồ',
            'rơi xuống ao',
            'rơi xuống sông'
        ],
        response: "**Nếu bất ngờ rơi xuống nước, điều đầu tiên em cần làm là giữ bình tĩnh.**\n\n" +
                  "Không vùng vẫy mạnh hoặc cố hét liên tục vì em sẽ nhanh mất sức.\n\n" +
                  "Hãy cố giữ cơ thể nổi, đưa mũi và miệng lên khỏi mặt nước, sau đó kêu cứu khi có thể.\n\n" +
                  "Nếu em đã được học nổi ngửa hoặc đứng nước, hãy sử dụng những kỹ năng đó để giữ sức trong lúc chờ người đến giúp."
    },

    {
        id: "first_thing_when_falling_water",
        keywords: [
            'rơi xuống nước làm gì đầu tiên',
            'viec dau tien khi roi xuong nuoc',
            'ngã xuống nước phải làm sao',
            'rơi xuống hồ phải làm gì',
            'xuống nước bất ngờ'
        ],
        response: "**Việc đầu tiên là: BÌNH TĨNH.**\n\n" +
                  "Khi bất ngờ rơi xuống nước, em có thể hoảng sợ và cử động rất mạnh. Điều đó làm em nhanh mất sức và dễ bị sặc nước hơn.\n\n" +
                  "Hãy cố thả lỏng, tìm cách đưa mặt lên khỏi nước và thực hiện kỹ năng nổi ngửa hoặc đứng nước nếu em đã được học.\n\n" +
                  "Sau đó hãy kêu cứu."
    },

    {
        id: "stay_calm_falling_water",
        keywords: [
            'bình tĩnh khi rơi xuống nước',
            'binh tinh duoi nuoc',
            'bị rơi xuống nước hoảng',
            'hoảng sợ dưới nước',
            'làm sao không hoảng'
        ],
        response: "**Giữ bình tĩnh là điều rất quan trọng khi em bất ngờ rơi xuống nước.**\n\n" +
                  "Nếu hoảng loạn, em thường vùng vẫy mạnh, thở gấp và nhanh mất sức.\n\n" +
                  "Hãy cố thả lỏng cơ thể, tập trung đưa mũi và miệng lên khỏi mặt nước rồi tìm cách giữ nổi.\n\n" +
                  "Khi đã ổn định hơn, hãy gọi người xung quanh giúp đỡ."
    },

    {
        id: "do_not_struggle_falling_water",
        keywords: [
            'có nên vùng vẫy không',
            'khong vung vay duoi nuoc',
            'vùng vẫy khi rơi xuống nước',
            'đạp nước loạn có sao không',
            'rơi xuống nước có nên quẫy mạnh'
        ],
        response: "**Không nên vùng vẫy mạnh khi rơi xuống nước.**\n\n" +
                  "Vùng vẫy làm cơ thể nhanh mệt và dễ khiến nước vào miệng, mũi.\n\n" +
                  "Thay vào đó, hãy cố bình tĩnh, thả lỏng và sử dụng kỹ năng giữ nổi mà em đã được học.\n\n" +
                  "Mục tiêu là giữ được đường thở trên mặt nước và tiết kiệm sức."
    },

    {
        id: "call_for_help_falling_water",
        keywords: [
            'rơi xuống nước kêu cứu',
            'keu cuu duoi nuoc',
            'bị ngã xuống nước gọi ai',
            'kêu cứu thế nào',
            'gọi người giúp'
        ],
        response: "**Nếu em rơi xuống nước và cần giúp đỡ, hãy kêu cứu thật to khi có thể.**\n\n" +
                  "Em có thể gọi: **“Cứu với!”**, **“Cháu bị rơi xuống nước!”** hoặc gọi người lớn ở gần.\n\n" +
                  "Nếu em đang giữ nổi tốt, có thể giơ một tay để ra hiệu nhưng không nên cử động quá mạnh làm mất thăng bằng.\n\n" +
                  "Sau khi gọi, tiếp tục cố giữ nổi và chờ hỗ trợ."
    },

    {
        id: "raise_hand_for_help_water",
        keywords: [
            'giơ tay kêu cứu',
            'gio tay duoi nuoc',
            'ra hiệu khi đuối nước',
            'tín hiệu cầu cứu dưới nước',
            'giơ tay khi rơi xuống nước'
        ],
        response: "**Nếu vẫn giữ được cơ thể nổi an toàn, em có thể giơ một tay để ra hiệu cho người xung quanh.**\n\n" +
                  "Tuy nhiên, em không nên cố vẫy cả hai tay hoặc cử động quá mạnh vì có thể làm cơ thể chìm hơn.\n\n" +
                  "Ưu tiên lớn nhất vẫn là giữ mặt trên mặt nước, kêu cứu và tiết kiệm sức."
    },

    {
        id: "keep_airway_above_water",
        keywords: [
            'giữ đầu trên mặt nước',
            'giu mieng mui tren nuoc',
            'không để sặc nước',
            'giữ mặt nổi',
            'thở khi rơi xuống nước'
        ],
        response: "**Khi rơi xuống nước, em cần cố giữ mũi và miệng ở trên mặt nước để có thể thở.**\n\n" +
                  "Kỹ năng nổi ngửa hoặc đứng nước sẽ giúp em làm việc này tốt hơn.\n\n" +
                  "Nếu đầu vừa bị chìm xuống, hãy cố bình tĩnh, tránh hít vào khi đang ở dưới nước và tìm cách đưa mặt trở lại mặt nước."
    },

    {
        id: "hold_breath_initial_fall",
        keywords: [
            'nín thở khi rơi xuống nước',
            'nin tho duoi nuoc',
            'rơi xuống nước có nín thở không',
            'bị chìm phải thở sao'
        ],
        response: "**Khi vừa bất ngờ bị chìm xuống nước, em cần tránh hít nước vào đường thở.**\n\n" +
                  "Tài liệu hướng dẫn người gặp nạn cần bình tĩnh, nín thở trong lúc đầu để hạn chế bị sặc và chờ cơ thể nổi lên.\n\n" +
                  "Ngay khi mặt lên khỏi nước, hãy thở bình thường, giữ nổi và kêu cứu."
    },

    {
        id: "back_float_self_rescue",
        keywords: [
            'nổi ngửa tự cứu',
            'noi ngua tu cuu',
            'rơi xuống nước nổi ngửa',
            'nằm ngửa dưới nước',
            'nổi ngửa khi gặp nạn'
        ],
        response: "**Nổi ngửa là một kỹ năng tự cứu rất quan trọng.**\n\n" +
                  "Khi nổi ngửa đúng cách, mặt, mũi và miệng được giữ trên mặt nước nên em có thể thở và nghỉ.\n\n" +
                  "Hãy thả lỏng cơ thể, giữ đầu ngửa nhẹ và cử động tay chân vừa đủ để giữ thăng bằng.\n\n" +
                  "Em nên học kỹ năng này với giáo viên trước để có thể sử dụng khi cần."
    },

    {
        id: "tread_water_self_rescue",
        keywords: [
            'đứng nước tự cứu',
            'dung nuoc tu cuu',
            'đứng nước khi rơi xuống',
            'giữ nổi bằng đứng nước',
            'đứng nước chờ cứu'
        ],
        response: "**Đứng nước giúp em giữ đầu và đường thở trên mặt nước trong khi chờ người đến hỗ trợ.**\n\n" +
                  "Tay và chân chỉ cần cử động vừa đủ để giữ cơ thể ổn định, không nên đạp hoặc quẫy quá mạnh.\n\n" +
                  "Nếu em thấy mệt, có thể chuyển sang nổi ngửa để tiết kiệm sức hơn."
    },

    {
        id: "float_or_tread_water_choice",
        keywords: [
            'nổi ngửa hay đứng nước',
            'noi hay dung nuoc',
            'nên nổi hay đứng nước',
            'tự cứu dùng kỹ năng nào'
        ],
        response: "**Nổi ngửa và đứng nước đều là kỹ năng an toàn quan trọng.**\n\n" +
                  "Đứng nước giúp em quan sát xung quanh và gọi cứu giúp. Nổi ngửa thường giúp tiết kiệm sức hơn khi em đã mệt.\n\n" +
                  "Em nên học cả hai kỹ năng và sử dụng kỹ năng phù hợp với tình huống, khả năng của mình."
    },

    {
        id: "look_for_safe_hold",
        keywords: [
            'tìm chỗ bám',
            'tim cho bam',
            'bám gì khi rơi xuống nước',
            'bám thành bể',
            'tìm vật để bám'
        ],
        response: "**Nếu gần em có một vị trí chắc chắn và an toàn để bám, hãy từ từ di chuyển tới đó.**\n\n" +
                  "Ví dụ như thành bể, dây phao hoặc vật nổi chắc chắn.\n\n" +
                  "Không nên cố với quá xa hoặc bám vào vật không chắc chắn vì em có thể mất thăng bằng.\n\n" +
                  "Nếu không có chỗ bám, hãy tiếp tục giữ nổi và kêu cứu."
    },

    {
        id: "use_floating_object_self_rescue",
        keywords: [
            'vật nổi để tự cứu',
            'vat noi tu cuu',
            'bám phao khi rơi xuống nước',
            'bám chai nhựa',
            'có vật nổi thì làm gì'
        ],
        response: "**Nếu gần em có phao hoặc vật nổi chắc chắn, hãy cố giữ lấy để hỗ trợ cơ thể nổi.**\n\n" +
                  "Không nên trèo hoặc đè mạnh lên một vật nhỏ khiến nó tuột khỏi tay.\n\n" +
                  "Hãy ôm hoặc bám chắc, giữ mặt trên mặt nước và tiếp tục gọi người giúp đỡ."
    },

    {
        id: "unexpected_fall_cannot_swim",
        keywords: [
            'không biết bơi bị rơi xuống nước',
            'khong biet boi roi xuong nuoc',
            'không biết bơi phải làm sao',
            'chưa biết bơi bị ngã xuống hồ'
        ],
        response: "**Nếu chưa biết bơi mà bất ngờ rơi xuống nước, em càng cần bình tĩnh.**\n\n" +
                  "Không vùng vẫy mạnh. Hãy cố thả lỏng, đưa mặt lên khỏi nước và kêu cứu.\n\n" +
                  "Nếu em đã từng được học nổi ngửa hoặc kỹ năng tự nổi, hãy sử dụng ngay.\n\n" +
                  "Nếu có vật nổi hoặc chỗ bám an toàn ở gần, hãy từ từ tiếp cận."
    },

    {
        id: "unexpected_fall_known_swimmer",
        keywords: [
            'biết bơi bị rơi xuống nước',
            'biet boi bi roi xuong nuoc',
            'bơi giỏi bị ngã xuống nước',
            'biết bơi thì tự cứu sao'
        ],
        response: "**Ngay cả khi biết bơi, em vẫn cần giữ bình tĩnh khi bất ngờ rơi xuống nước.**\n\n" +
                  "Không nên lập tức bơi thật nhanh nếu chưa biết mình đang ở đâu hoặc dòng nước có nguy hiểm không.\n\n" +
                  "Hãy nổi lên, quan sát xung quanh, đánh giá chỗ an toàn rồi mới từ từ di chuyển.\n\n" +
                  "Nếu thấy mệt hoặc dòng nước bất thường, hãy giữ nổi và gọi hỗ trợ."
    },

    {
        id: "turn_body_to_back_float",
        keywords: [
            'xoay người nổi ngửa',
            'xoay tu the duoi nuoc',
            'từ sấp sang ngửa',
            'rơi xuống nước xoay người',
            'đổi tư thế dưới nước'
        ],
        response: "**Biết xoay chuyển tư thế cơ thể giúp em xử lý tốt hơn khi bất ngờ rơi xuống nước.**\n\n" +
                  "Nếu đang ở tư thế sấp hoặc mất phương hướng, em có thể sử dụng kỹ năng đã học để chuyển sang nổi ngửa hoặc đứng nước.\n\n" +
                  "Việc này giúp em kiểm soát hơi thở và giảm hoảng loạn.\n\n" +
                  "Kỹ năng này cần được luyện tập trước trong lớp học bơi an toàn."
    },

    {
        id: "unexpected_fall_disoriented",
        keywords: [
            'mất phương hướng dưới nước',
            'mat phuong huong duoi nuoc',
            'rơi xuống nước không biết hướng',
            'không biết đâu là mặt nước',
            'bị chìm hoảng loạn'
        ],
        response: "**Khi bất ngờ rơi xuống nước, em có thể bị mất phương hướng và rất dễ hoảng sợ.**\n\n" +
                  "Hãy cố giữ bình tĩnh và sử dụng những kỹ năng đã học để đưa cơ thể lên mặt nước.\n\n" +
                  "Khi mặt lên khỏi nước, hãy ổn định tư thế bằng nổi ngửa hoặc đứng nước rồi mới tìm cách thoát ra."
    },

    {
        id: "self_rescue_if_alone",
        keywords: [
            'rơi xuống nước không có ai',
            'khong co ai cuu',
            'một mình rơi xuống nước',
            'không ai nghe kêu cứu',
            'tự cứu khi một mình'
        ],
        response: "**Nếu chưa có người đến giúp, em cần cố duy trì trạng thái an toàn càng lâu càng tốt.**\n\n" +
                  "Hãy giữ cơ thể nổi bằng nổi ngửa hoặc đứng nước, tiết kiệm sức và tiếp tục quan sát xung quanh.\n\n" +
                  "Nếu xác định được vị trí an toàn ở gần và em có khả năng di chuyển, hãy từ từ tiến về đó.\n\n" +
                  "Không nên cố bơi thật nhanh khi đã mệt."
    },

    {
        id: "self_rescue_move_to_shore",
        keywords: [
            'tự bơi vào bờ',
            'tu boi vao bo',
            'rơi xuống nước vào bờ thế nào',
            'tự cứu vào bờ',
            'bơi về nơi an toàn'
        ],
        response: "**Nếu đã giữ được bình tĩnh và xác định được nơi an toàn, em có thể từ từ di chuyển vào bờ theo khả năng của mình.**\n\n" +
                  "Không nên cố bơi nhanh hoặc bơi quá sức.\n\n" +
                  "Nếu thấy mệt, hãy chuyển sang nổi ngửa hoặc đứng nước để nghỉ và gọi hỗ trợ."
    },

    {
        id: "self_rescue_do_not_overexert",
        keywords: [
            'có nên cố bơi vào bờ',
            'co boi het suc khong',
            'bơi hết sức khi gặp nạn',
            'mệt vẫn cố bơi',
            'đuối sức có bơi tiếp'
        ],
        response: "**Không nên cố bơi đến kiệt sức.**\n\n" +
                  "Nếu em cảm thấy quá mệt, việc cố bơi nhanh có thể khiến em mất khả năng giữ nổi.\n\n" +
                  "Hãy nghỉ bằng nổi ngửa hoặc đứng nước, gọi cứu giúp và chỉ tiếp tục di chuyển khi cơ thể ổn định hơn."
    },

    {
        id: "self_rescue_breath_control",
        keywords: [
            'thở thế nào khi tự cứu',
            'tho khi gap nan',
            'thở dưới nước sao',
            'giữ nhịp thở khi nổi',
            'thở chậm dưới nước'
        ],
        response: "**Khi đã đưa mặt lên khỏi nước, hãy cố gắng thở chậm và đều.**\n\n" +
                  "Thở quá nhanh do hoảng sợ sẽ làm em nhanh mệt hơn.\n\n" +
                  "Giữ nhịp thở ổn định kết hợp với nổi ngửa hoặc đứng nước sẽ giúp em tiết kiệm sức trong lúc chờ hỗ trợ."
    },

    {
        id: "self_rescue_safe_skills_to_learn",
        keywords: [
            'cần học kỹ năng tự cứu nào',
            'hoc ky nang tu cuu',
            'kỹ năng sinh tồn cần học',
            'học gì để tự cứu dưới nước',
            'kỹ năng khi rơi xuống nước'
        ],
        response: "**Để tự bảo vệ mình khi gặp sự cố dưới nước, em nên học một số kỹ năng quan trọng:**\n\n" +
                  "✅ Nổi ngửa.\n" +
                  "✅ Đứng nước.\n" +
                  "✅ Xoay chuyển tư thế cơ thể.\n" +
                  "✅ Kiểm soát hơi thở.\n" +
                  "✅ Kêu cứu và nhận biết nơi an toàn.\n\n" +
                  "Những kỹ năng này nên được học và thực hành với giáo viên hoặc người hướng dẫn."
    },

    {
        id: "self_rescue_not_same_as_swimming",
        keywords: [
            'tự cứu có phải biết bơi không',
            'tu cuu va boi',
            'biết bơi là đủ chưa',
            'bơi giỏi có cần tự cứu',
            'biết bơi với tự cứu khác nhau'
        ],
        response: "**Biết bơi và biết tự cứu không hoàn toàn giống nhau.**\n\n" +
                  "Biết bơi giúp em di chuyển trong nước, nhưng kỹ năng tự cứu còn bao gồm giữ bình tĩnh, nổi ngửa, đứng nước, kiểm soát hơi thở và xử lý khi bất ngờ rơi xuống nước.\n\n" +
                  "Vì vậy, ngay cả người biết bơi vẫn cần học kỹ năng tự cứu."
    },

    {
        id: "self_rescue_summary",
        keywords: [
            'nhớ gì khi rơi xuống nước',
            'quy tac tu cuu',
            'tóm tắt tự cứu',
            'tự cứu thế nào',
            'rơi xuống nước nhớ gì'
        ],
        response: "**Nếu bất ngờ rơi xuống nước, em hãy nhớ:**\n\n" +
                  "1. **Bình tĩnh.**\n" +
                  "2. **Không vùng vẫy mạnh.**\n" +
                  "3. **Giữ mũi, miệng trên mặt nước.**\n" +
                  "4. **Nổi ngửa hoặc đứng nước nếu đã được học.**\n" +
                  "5. **Kêu cứu và tìm chỗ bám an toàn.**\n" +
                  "6. Chỉ từ từ di chuyển vào bờ khi đủ sức và xác định được nơi an toàn.\n\n" +
                  "Câu dễ nhớ: **Bình tĩnh – Giữ nổi – Kêu cứu – Tìm an toàn.**"
    },
 {
        id: "see_drowning_person_general",
        keywords: [
            'thấy người đuối nước',
            'thay nguoi duoi nuoc',
            'bạn bị đuối nước',
            'ban bi duoi nuoc',
            'người rơi xuống nước',
            'thấy bạn gặp nạn'
        ],
        response: "**Nếu thấy một người đang bị đuối nước, em cần hành động nhanh nhưng phải bảo đảm an toàn cho mình.**\n\n" +
                  "Việc đầu tiên là **hô thật to để gọi người lớn, nhân viên cứu hộ hoặc người xung quanh đến giúp**.\n\n" +
                  "Em không được tự nhảy xuống nước để cứu, kể cả khi em biết bơi.\n\n" +
                  "Nếu có thể hỗ trợ từ trên bờ, hãy tìm phao, dây, gậy, cành cây hoặc vật nổi để đưa hoặc ném cho người gặp nạn."
    },

    {
        id: "do_not_jump_rescue",
        keywords: [
            'có nên nhảy xuống cứu',
            'nhay xuong cuu ban',
            'bơi ra cứu bạn',
            'xuống nước cứu người',
            'lao xuống cứu',
            'cứu trực tiếp được không'
        ],
        response: "**Không. Trẻ em không nên tự nhảy xuống nước để cứu người bị đuối nước.**\n\n" +
                  "Người đang hoảng loạn có thể bấu, ôm hoặc kéo người cứu xuống nước.\n\n" +
                  "Khi đó, thay vì một người gặp nạn có thể trở thành hai người cùng nguy hiểm.\n\n" +
                  "Em hãy nhớ: **Gọi người lớn – Dùng vật hỗ trợ – Không tự xuống nước.**"
    },

    {
        id: "good_swimmer_can_rescue",
        keywords: [
            'bơi giỏi có cứu được không',
            'boi gioi cuu ban',
            'biết bơi có nên cứu',
            'bơi giỏi nhảy xuống cứu',
            'em bơi giỏi mà'
        ],
        response: "**Biết bơi giỏi vẫn chưa đủ để cứu đuối trực tiếp.**\n\n" +
                  "Cứu một người đang hoảng loạn dưới nước khó hơn rất nhiều so với bơi bình thường.\n\n" +
                  "Người gặp nạn có thể bấu víu rất mạnh và kéo cả người cứu xuống nước.\n\n" +
                  "Vì vậy, học sinh vẫn nên cứu từ trên bờ và gọi người lớn hoặc nhân viên cứu hộ chuyên nghiệp."
    },

    {
        id: "call_adult_when_drowning",
        keywords: [
            'bạn đuối nước gọi ai',
            'goi ai cuu ban',
            'thấy người chìm báo ai',
            'gọi người lớn',
            'gọi cứu hộ'
        ],
        response: "**Khi thấy người gặp nạn dưới nước, hãy gọi người lớn hoặc nhân viên cứu hộ ngay.**\n\n" +
                  "Em có thể hô thật to: **“Có người bị đuối nước! Cứu với!”** để mọi người chú ý.\n\n" +
                  "Nếu có điện thoại và tình huống cần cấp cứu y tế, có thể gọi **115**.\n\n" +
                  "Trong khi chờ người lớn, chỉ hỗ trợ từ vị trí an toàn."
    },

    {
        id: "rescue_from_shore_general",
        keywords: [
            'cứu từ trên bờ',
            'cuu tren bo',
            'cứu bạn không xuống nước',
            'cứu đuối gián tiếp',
            'cách cứu an toàn'
        ],
        response: "**Cứu từ trên bờ là cách phù hợp và an toàn hơn đối với học sinh.**\n\n" +
                  "Em có thể dùng vật dài để người gặp nạn bám vào, hoặc ném vật nổi cho họ.\n\n" +
                  "Các vật có thể dùng gồm gậy, cành cây, sào, dây, quần áo nối lại, phao hoặc can nhựa rỗng.\n\n" +
                  "Luôn gọi thêm người lớn hỗ trợ."
    },

    {
        id: "rescue_near_shore",
        keywords: [
            'người đuối gần bờ',
            'gan bo cuu sao',
            'bạn bị đuối gần bờ',
            'người ở sát bờ',
            'cứu người gần mép nước'
        ],
        response: "**Nếu người gặp nạn ở gần bờ, em vẫn không được đưa tay trực tiếp cho họ nắm.**\n\n" +
                  "Hãy tìm gậy, sào, cành cây, mái chèo hoặc một vật dài để đưa về phía họ.\n\n" +
                  "Em cần đứng hoặc nằm ở vị trí thật chắc chắn để không bị kéo xuống nước.\n\n" +
                  "Hướng dẫn người gặp nạn bám vào vật rồi gọi người lớn cùng hỗ trợ kéo vào bờ."
    },

    {
        id: "do_not_offer_bare_hand",
        keywords: [
            'đưa tay kéo người đuối',
            'dua tay cho ban nam',
            'nắm tay người đuối',
            'kéo bạn bằng tay',
            'có nên đưa tay không'
        ],
        response: "**Không nên đưa tay trần trực tiếp cho người đang hoảng loạn dưới nước nắm.**\n\n" +
                  "Người gặp nạn có thể nắm rất chặt và kéo em xuống theo.\n\n" +
                  "Hãy dùng một vật dài như gậy, cành cây, sào hoặc dây để giữ khoảng cách an toàn."
    },

    {
        id: "rescue_with_stick",
        keywords: [
            'dùng gậy cứu người',
            'dung gay cuu nguoi',
            'gậy cứu đuối',
            'đưa sào cứu bạn',
            'cành cây cứu người'
        ],
        response: "**Nếu người gặp nạn ở gần bờ, em có thể dùng gậy, sào hoặc cành cây để hỗ trợ.**\n\n" +
                  "Hãy gọi người lớn trước, sau đó giữ cơ thể ở vị trí chắc chắn và đưa đầu vật đó về phía người gặp nạn.\n\n" +
                  "Bảo họ bám thật chắc rồi từ từ kéo về phía bờ.\n\n" +
                  "Nếu em cảm thấy mình có thể bị kéo xuống nước, hãy thả vật ra và lùi lại."
    },

    {
        id: "rescue_with_rope",
        keywords: [
            'dùng dây cứu người',
            'dung day cuu ban',
            'ném dây cứu',
            'dây cứu đuối',
            'quăng dây'
        ],
        response: "**Dây có thể được dùng để hỗ trợ người gặp nạn từ trên bờ.**\n\n" +
                  "Nếu người ở xa tầm gậy, có thể ném dây về phía họ và hướng dẫn họ bám hoặc nắm chắc.\n\n" +
                  "Em cần đứng ở nơi chắc chắn và nên có người lớn hỗ trợ khi kéo.\n\n" +
                  "Không quấn dây quanh người mình vì có thể bị kéo xuống nước."
    },

    {
        id: "rescue_with_clothes",
        keywords: [
            'dùng áo cứu người',
            'quan ao cuu duoi',
            'nối quần áo cứu',
            'dùng khăn cứu bạn',
            'thắt lưng cứu người'
        ],
        response: "**Khi không có dây hoặc gậy, có thể dùng quần áo, khăn hoặc thắt lưng làm vật nối nếu đủ chắc chắn.**\n\n" +
                  "Mục đích là để người gặp nạn có vật bám mà em không phải tiến sát mép nước.\n\n" +
                  "Nếu vật quá ngắn hoặc không chắc chắn, đừng cố sử dụng. Hãy tiếp tục gọi người lớn và tìm vật phù hợp hơn."
    },

    {
        id: "throw_lifebuoy",
        keywords: [
            'ném phao cứu người',
            'nem phao cuu ban',
            'quăng phao',
            'phao cứu đuối',
            'ném áo phao'
        ],
        response: "**Nếu có phao hoặc áo phao, hãy ném về phía người gặp nạn để họ bám vào.**\n\n" +
                  "Cố ném vật nổi đến gần họ nhưng không cần em phải bước xuống nước.\n\n" +
                  "Sau đó tiếp tục gọi người lớn hoặc nhân viên cứu hộ để đưa người gặp nạn vào bờ."
    },

    {
        id: "throw_floating_object",
        keywords: [
            'ném vật nổi',
            'vat noi cuu nguoi',
            'can nhựa cứu đuối',
            'thùng nhựa cứu người',
            'bóng cứu người'
        ],
        response: "**Nếu không có phao, em có thể tìm vật nổi phù hợp để ném cho người gặp nạn.**\n\n" +
                  "Theo tài liệu, có thể dùng vòng phao, quả bóng, can nhựa hoặc vật khác có khả năng nổi.\n\n" +
                  "Người gặp nạn có thể bám vào vật đó để giữ cơ thể nổi trong lúc chờ hỗ trợ.\n\n" +
                  "Em vẫn phải gọi người lớn hoặc cứu hộ ngay."
    },

    {
        id: "plastic_container_rescue",
        keywords: [
            'can nhựa cứu người',
            'chai nhựa cứu bạn',
            'can rong cuu duoi',
            'thùng nhựa nổi',
            'bình nhựa cứu người'
        ],
        response: "**Một can hoặc thùng nhựa rỗng, có nắp kín và nổi tốt có thể được dùng làm vật hỗ trợ trong tình huống khẩn cấp.**\n\n" +
                  "Em có thể ném vật đó về phía người gặp nạn để họ bám vào.\n\n" +
                  "Không cần cố ném thật trúng người; chỉ cần vật nổi ở đủ gần để họ có thể với tới.\n\n" +
                  "Sau đó tiếp tục gọi cứu hộ hoặc người lớn."
    },

    {
        id: "rescue_far_from_shore",
        keywords: [
            'người đuối xa bờ',
            'xa bo cuu sao',
            'bạn bị đuối xa',
            'người ở giữa hồ',
            'cứu người ngoài xa'
        ],
        response: "**Nếu người bị đuối nước ở xa bờ, trẻ em tuyệt đối không được bơi ra cứu.**\n\n" +
                  "Hãy nhanh chóng gọi người lớn hoặc lực lượng cứu hộ.\n\n" +
                  "Nếu có phao, can nhựa, bóng hoặc vật nổi, có thể ném ra cho người gặp nạn bám.\n\n" +
                  "Nếu có dây đủ dài và sử dụng được an toàn, người lớn có thể dùng dây để hỗ trợ kéo vào bờ."
    },

    {
        id: "talk_to_drowning_person",
        keywords: [
            'nói gì với người đuối',
            'noi gi voi ban duoi nuoc',
            'trấn an người gặp nạn',
            'bảo bạn bình tĩnh',
            'động viên người đuối'
        ],
        response: "**Nếu người gặp nạn còn nghe được, em có thể nói thật to để giúp họ bình tĩnh.**\n\n" +
                  "Ví dụ: **“Bình tĩnh nhé! Bám vào phao!”**, **“Có người đang đến giúp!”** hoặc **“Giữ lấy cây này!”**\n\n" +
                  "Việc trấn an có thể giúp họ bớt hoảng sợ và thực hiện theo hướng dẫn."
    },

    {
        id: "safe_position_when_pulling",
        keywords: [
            'đứng thế nào khi kéo người',
            'tu the cuu tren bo',
            'kéo người sao cho an toàn',
            'nằm xuống kéo bạn',
            'không bị kéo xuống nước'
        ],
        response: "**Khi hỗ trợ kéo người từ trên bờ, em phải giữ tư thế thật chắc chắn.**\n\n" +
                  "Tài liệu hướng dẫn có thể nằm thấp xuống để cơ thể vững hơn và giảm nguy cơ bị kéo xuống nước.\n\n" +
                  "Không đứng sát mép nước hoặc cúi người quá xa.\n\n" +
                  "Tốt nhất nên có thêm người lớn hỗ trợ."
    },

    {
        id: "if_victim_grabs_rescuer",
        keywords: [
            'người đuối nắm tay mình',
            'bi nam tay khi cuu',
            'bạn kéo mình xuống',
            'người gặp nạn bấu mình',
            'bị kéo xuống nước'
        ],
        response: "**Nếu người gặp nạn cố nắm hoặc kéo trực tiếp em xuống nước, em phải ưu tiên an toàn của mình.**\n\n" +
                  "Hãy buông tay hoặc lùi ra khỏi mép nước, sau đó tiếp tục dùng vật hỗ trợ như gậy, dây hoặc phao.\n\n" +
                  "Không cố giữ người bằng tay nếu em có nguy cơ bị kéo xuống."
    },

    {
        id: "rescue_multiple_friends",
        keywords: [
            'nhiều bạn bị đuối',
            'nhieu nguoi duoi nuoc',
            'hai bạn bị rơi xuống nước',
            'cả nhóm gặp nạn',
            'nhiều người gặp nạn'
        ],
        response: "**Nếu có nhiều người cùng gặp nạn, em càng không được tự xuống nước cứu.**\n\n" +
                  "Hãy hô thật to để gọi nhiều người lớn và lực lượng cứu hộ đến hỗ trợ.\n\n" +
                  "Nếu có nhiều phao hoặc vật nổi, hãy ném về phía những người gặp nạn.\n\n" +
                  "Không để thêm người trở thành nạn nhân vì cố cứu trực tiếp."
    },

    {
        id: "friend_falls_in_pool",
        keywords: [
            'bạn rơi xuống hồ bơi',
            'ban roi xuong be',
            'bạn chìm ở bể bơi',
            'thấy bạn gặp nạn ở hồ',
            'bạn bị đuối trong bể'
        ],
        response: "**Nếu thấy bạn gặp nạn trong bể bơi, hãy gọi nhân viên cứu hộ, giáo viên hoặc người lớn ngay.**\n\n" +
                  "Không tự nhảy xuống cứu nếu em chưa được đào tạo cứu hộ.\n\n" +
                  "Nếu gần đó có phao hoặc vật hỗ trợ, hãy đưa hoặc ném cho bạn trong khi chờ người lớn đến."
    },

    {
        id: "friend_falls_in_river",
        keywords: [
            'bạn rơi xuống sông',
            'ban roi xuong song',
            'bạn bị cuốn sông',
            'người rơi xuống sông',
            'thấy bạn chìm ở sông'
        ],
        response: "**Nếu bạn rơi xuống sông, em tuyệt đối không được nhảy theo xuống cứu.**\n\n" +
                  "Sông có thể có nước sâu, dòng chảy mạnh hoặc nước xoáy.\n\n" +
                  "Hãy gọi người lớn hoặc cứu hộ ngay và tìm phao, dây, gậy hoặc vật nổi để hỗ trợ từ bờ."
    },

    {
        id: "friend_falls_in_pond",
        keywords: [
            'bạn rơi xuống ao',
            'ban roi xuong ao',
            'bạn chìm trong ao',
            'cứu bạn ở ao',
            'người rơi xuống hồ'
        ],
        response: "**Nếu bạn rơi xuống ao hoặc hồ, em không nên tự xuống nước.**\n\n" +
                  "Hãy hô cứu, gọi người lớn và tìm vật dài hoặc vật nổi để hỗ trợ.\n\n" +
                  "Đừng đứng sát mép ao vì bờ có thể trơn và em cũng có thể bị rơi xuống."
    },

    {
        id: "rescue_order_to_remember",
        keywords: [
            'cứu bạn theo thứ tự nào',
            'thu tu cuu duoi',
            'cứu người bắt đầu từ đâu',
            'thấy người đuối làm gì trước'
        ],
        response: "**Khi thấy người bị đuối nước, em có thể nhớ thứ tự sau:**\n\n" +
                  "1. **Hô cứu thật to.**\n" +
                  "2. **Gọi người lớn hoặc cứu hộ.**\n" +
                  "3. **Không tự nhảy xuống nước.**\n" +
                  "4. **Đưa vật dài** nếu người ở gần bờ.\n" +
                  "5. **Ném vật nổi** nếu người ở xa hơn.\n\n" +
                  "An toàn của em phải được bảo đảm trong suốt quá trình giúp đỡ."
    },

    {
        id: "safe_rescue_memory_rule",
        keywords: [
            'quy tắc cứu đuối',
            'quy tac cuu ban',
            'nhớ gì khi cứu người',
            'cứu đuối an toàn nhớ gì',
            'câu dễ nhớ cứu đuối'
        ],
        response: "**Em hãy nhớ câu: GỌI – ĐƯA – NÉM – KHÔNG NHẢY.**\n\n" +
                  "📣 **GỌI:** Gọi người lớn hoặc cứu hộ.\n" +
                  "🦯 **ĐƯA:** Đưa gậy, sào, cành cây nếu người ở gần.\n" +
                  "🛟 **NÉM:** Ném phao, dây hoặc vật nổi nếu ở xa.\n" +
                  "🚫 **KHÔNG NHẢY:** Trẻ em không tự nhảy xuống cứu trực tiếp.\n\n" +
                  "Đây là cách giúp người khác mà vẫn bảo vệ được chính mình."
    },
{
        id: "after_drowning_rescue_general",
        keywords: [
            'đưa người lên bờ rồi làm gì',
            'len bo roi lam gi',
            'cứu lên bờ',
            'sau khi cứu đuối',
            'vớt người lên bờ',
            'người đuối lên bờ'
        ],
        response: "**Sau khi đưa người gặp nạn lên bờ, cần nhanh chóng kiểm tra tình trạng của họ và gọi người lớn hỗ trợ.**\n\n" +
                  "Hãy đưa người bị nạn đến vị trí an toàn, quan sát xem họ có tỉnh táo, phản ứng và thở hay không.\n\n" +
                  "Nếu tình trạng nghiêm trọng, cần gọi cấp cứu **115** ngay.\n\n" +
                  "Học sinh không nên tự thực hiện những kỹ thuật sơ cấp cứu phức tạp nếu chưa được hướng dẫn và luyện tập đúng cách."
    },

    {
        id: "check_drowning_person_response",
        keywords: [
            'kiểm tra người bị đuối',
            'kiem tra nan nhan',
            'người bị đuối có tỉnh không',
            'kiểm tra phản ứng',
            'gọi mà không trả lời'
        ],
        response: "**Sau khi người gặp nạn đã ở nơi an toàn, cần kiểm tra xem họ có phản ứng hay không.**\n\n" +
                  "Có thể gọi to, nói chuyện với họ và quan sát xem họ có trả lời hoặc cử động hay không.\n\n" +
                  "Nếu người đó không phản ứng, hãy gọi người lớn và cấp cứu **115** ngay."
    },

    {
        id: "drowning_person_awake",
        keywords: [
            'người bị đuối còn tỉnh',
            'nan nhan con tinh',
            'cứu lên vẫn tỉnh',
            'người đuối nói được',
            'còn phản ứng'
        ],
        response: "**Nếu người gặp nạn còn tỉnh, hãy giúp họ ở nơi an toàn và trấn an để họ bình tĩnh.**\n\n" +
                  "Không nên để họ tiếp tục xuống nước hoặc tự ý bỏ đi ngay.\n\n" +
                  "Hãy gọi người lớn đến hỗ trợ và tiếp tục quan sát tình trạng của họ.\n\n" +
                  "Nếu xuất hiện ho nhiều, khó thở, mệt bất thường hoặc nhận thức không bình thường thì cần được đưa đến cơ sở y tế."
    },

    {
        id: "drowning_person_unconscious",
        keywords: [
            'người bị đuối bất tỉnh',
            'bat tinh sau duoi nuoc',
            'cứu lên không tỉnh',
            'không phản ứng',
            'người đuối nằm im'
        ],
        response: "**Nếu người bị đuối nước không tỉnh hoặc không phản ứng, đây là tình huống khẩn cấp.**\n\n" +
                  "Hãy gọi thật to để tìm người lớn trợ giúp và gọi cấp cứu **115** ngay.\n\n" +
                  "Nếu có người đã được huấn luyện sơ cấp cứu, họ cần nhanh chóng kiểm tra hô hấp và thực hiện các bước cấp cứu phù hợp.\n\n" +
                  "Không mất thời gian làm những việc như dốc ngược hoặc xốc nước."
    },

    {
        id: "drowning_person_not_breathing",
        keywords: [
            'người bị đuối không thở',
            'khong tho sau duoi nuoc',
            'cứu lên không thở',
            'ngừng thở',
            'không thấy thở'
        ],
        response: "**Nếu người gặp nạn không thở, cần gọi cấp cứu 115 và người lớn hỗ trợ ngay lập tức.**\n\n" +
                  "Đây là tình huống cần sơ cấp cứu khẩn cấp.\n\n" +
                  "Người đã được học và thực hành kỹ năng hồi sức cần thực hiện theo đúng kỹ thuật đã được hướng dẫn.\n\n" +
                  "Tuyệt đối không dốc ngược người bị nạn để cố làm nước chảy ra."
    },

    {
        id: "call_115_drowning",
        keywords: [
            'gọi 115 khi nào',
            'goi 115 duoi nuoc',
            'số cấp cứu đuối nước',
            'gọi cấp cứu',
            'cấp cứu số mấy'
        ],
        response: "**Trong tình huống đuối nước nghiêm trọng, hãy gọi cấp cứu y tế 115.**\n\n" +
                  "Đặc biệt cần gọi ngay nếu người gặp nạn bất tỉnh, không thở, khó thở hoặc có biểu hiện bất thường sau khi được đưa lên bờ.\n\n" +
                  "Nếu em là học sinh, hãy vừa gọi người lớn vừa nhờ người khác gọi 115 càng sớm càng tốt."
    },

    {
        id: "first_aid_get_adult_help",
        keywords: [
            'em có tự sơ cứu được không',
            'hoc sinh so cuu',
            'gọi người lớn giúp',
            'trẻ em sơ cứu',
            'em phải làm gì'
        ],
        response: "**Học sinh cần gọi người lớn hỗ trợ càng sớm càng tốt.**\n\n" +
                  "Nếu em đã được thầy cô hoặc người có chuyên môn hướng dẫn kỹ năng sơ cấp cứu, em có thể thực hiện những kỹ năng phù hợp mà mình đã được học.\n\n" +
                  "Nếu chưa được học, ưu tiên của em là **gọi người lớn – gọi 115 – giữ hiện trường an toàn**."
    },

    {
        id: "cpr_definition_simple",
        keywords: [
            'cpr là gì',
            'CPR',
            'hồi sức tim phổi',
            'hoi suc tim phoi',
            'ép tim hô hấp'
        ],
        response: "**CPR là hồi sức tim phổi, một kỹ thuật cấp cứu được sử dụng khi người gặp nạn bị ngừng tim hoặc ngừng thở.**\n\n" +
                  "Tài liệu giới thiệu CPR gồm các nội dung về tuần hoàn, đường thở và hô hấp.\n\n" +
                  "Đây là kỹ năng cần được học và thực hành đúng cách với người hướng dẫn chuyên môn.\n\n" +
                  "Học sinh không nên tự tập CPR trên bạn bè để thử."
    },

    {
        id: "cab_first_aid_meaning",
        keywords: [
            'CAB là gì',
            'cab so cuu',
            'C A B cấp cứu',
            'quy trình CAB'
        ],
        response: "**Trong tài liệu, CAB là cách ghi nhớ các nội dung sơ cấp cứu:**\n\n" +
                  "**C – Circulation:** Tuần hoàn, ép tim ngoài lồng ngực.\n" +
                  "**A – Airway:** Khai thông đường thở và kiểm tra hơi thở.\n" +
                  "**B – Breathing:** Hỗ trợ hô hấp.\n\n" +
                  "Đây là kỹ năng thực hành cần được giáo viên hoặc người có chuyên môn hướng dẫn trực tiếp."
    },

    {
        id: "chest_compression_only_if_trained",
        keywords: [
            'ép tim người đuối nước',
            'ep tim cuu nguoi',
            'ấn ngực người đuối',
            'có phải ép tim không',
            'ép tim thế nào'
        ],
        response: "**Ép tim ngoài lồng ngực là một kỹ năng sơ cấp cứu quan trọng khi người gặp nạn ngừng tim.**\n\n" +
                  "Tuy nhiên, với học sinh, kỹ năng này cần được học và luyện tập đúng cách dưới sự hướng dẫn của người có chuyên môn.\n\n" +
                  "Nếu gặp tình huống thật mà em chưa được học, hãy gọi người lớn và cấp cứu **115** ngay thay vì tự đoán cách thực hiện."
    },

    {
        id: "rescue_breathing_only_if_trained",
        keywords: [
            'hô hấp nhân tạo',
            'ho hap nhan tao',
            'thổi ngạt',
            'thổi hơi cứu người',
            'hà hơi'
        ],
        response: "**Hô hấp nhân tạo là một phần của kỹ năng hồi sức được tài liệu giới thiệu trong sơ cấp cứu.**\n\n" +
                  "Kỹ thuật này cần được học và thực hành đúng cách với người hướng dẫn.\n\n" +
                  "Nếu em chưa từng được huấn luyện, hãy gọi người lớn và 115 ngay để người có kỹ năng thực hiện."
    },

    {
        id: "do_not_upend_drowning_victim",
        keywords: [
            'xốc nước',
            'soc nuoc',
            'dốc ngược người đuối',
            'vác người chạy',
            'úp người cho ra nước',
            'dốc nước ra'
        ],
        response: "**Tuyệt đối không xốc nước hoặc dốc ngược người bị đuối nước.**\n\n" +
                  "Không nên vác người gặp nạn lên vai rồi chạy hoặc treo ngược để cố làm nước chảy ra.\n\n" +
                  "Việc này làm chậm thời gian cấp cứu cần thiết và có thể khiến tình trạng nguy hiểm hơn.\n\n" +
                  "Hãy gọi cấp cứu và tập trung vào các bước sơ cấp cứu đúng đã được hướng dẫn."
    },

    {
        id: "why_not_upend_drowning_victim",
        keywords: [
            'vì sao không xốc nước',
            'tai sao khong soc nuoc',
            'dốc ngược có sao không',
            'xốc nước nguy hiểm'
        ],
        response: "**Không nên xốc nước vì vấn đề nguy hiểm chính của người bị đuối nước là thiếu oxy, không phải cần dốc cho nước chảy ra trước.**\n\n" +
                  "Xốc ngược người gặp nạn sẽ làm chậm việc cung cấp oxy và cấp cứu cần thiết.\n\n" +
                  "Tài liệu cũng cảnh báo việc này có thể làm chất trong dạ dày trào ngược vào đường thở."
    },

    {
        id: "do_not_waste_time_drain_water",
        keywords: [
            'có cần làm nước chảy ra không',
            'lay nuoc ra khoi nguoi',
            'nước trong phổi làm sao',
            'đổ nước ra trước',
            'làm cho hết nước'
        ],
        response: "**Không nên mất thời gian cố dốc hoặc xốc người gặp nạn để làm nước chảy ra.**\n\n" +
                  "Nếu người đó không tỉnh hoặc không thở, cần gọi cấp cứu và thực hiện sơ cấp cứu đúng cách càng sớm càng tốt.\n\n" +
                  "Thời gian rất quan trọng trong cấp cứu đuối nước."
    },

    {
        id: "do_not_practice_cpr_on_friends",
        keywords: [
            'tập ép tim với bạn',
            'tap cpr voi ban',
            'thử hô hấp nhân tạo',
            'tập sơ cứu trên người',
            'thực hành ép tim bạn'
        ],
        response: "**Không được thực hành thử CPR hoặc các kỹ thuật sơ cấp cứu trên bạn bè khỏe mạnh.**\n\n" +
                  "Tài liệu yêu cầu học sinh thực hành trên **mô hình** khi học kỹ năng.\n\n" +
                  "Chỉ thực hiện trên người thật khi đó là người đang gặp nạn và kỹ năng cần được áp dụng để cấp cứu."
    },

    {
        id: "practice_first_aid_on_mannequin",
        keywords: [
            'tập sơ cứu bằng gì',
            'mo hinh so cuu',
            'tập CPR ở đâu',
            'học ép tim thế nào',
            'tập hồi sức'
        ],
        response: "**Khi học sơ cấp cứu, học sinh nên thực hành trên mô hình dưới sự hướng dẫn của giáo viên hoặc người có chuyên môn.**\n\n" +
                  "Không nên dùng bạn bè làm người để thử ép tim hoặc các kỹ thuật hồi sức.\n\n" +
                  "Việc luyện tập đúng giúp em biết phải làm gì khi thật sự gặp tình huống khẩn cấp."
    },

    {
        id: "drowning_person_coughing_after_rescue",
        keywords: [
            'cứu lên bị ho',
            'ho sau khi sặc nước',
            'ho sau boi',
            'sặc nước rồi ho',
            'người đuối ho nhiều'
        ],
        response: "**Sau khi tắm, bơi hoặc bị sặc nước, nếu người đó ho nhiều hoặc có biểu hiện bất thường thì cần được người lớn theo dõi.**\n\n" +
                  "Nếu có khó thở, mệt nhiều, khó chịu hoặc nhận thức không bình thường, tài liệu khuyến cáo cần đến cơ sở y tế gần nhất để kiểm tra."
    },

    {
        id: "breathing_difficulty_after_water",
        keywords: [
            'khó thở sau sặc nước',
            'kho tho sau boi',
            'sặc nước khó thở',
            'lên bờ vẫn khó thở',
            'thở mệt sau bơi'
        ],
        response: "**Khó thở sau khi bị sặc nước là dấu hiệu không nên bỏ qua.**\n\n" +
                  "Theo tài liệu, sau khi tắm, bơi hoặc sặc nước mà xuất hiện khó thở, ho, mệt mỏi hoặc nhận thức bất thường thì cần đến cơ sở y tế để được kiểm tra kịp thời.\n\n" +
                  "Hãy báo ngay cho người lớn."
    },

    {
        id: "fatigue_after_water_incident",
        keywords: [
            'mệt sau sặc nước',
            'met sau khi duoi nuoc',
            'cứu lên vẫn mệt',
            'mệt bất thường sau bơi',
            'đuối sức sau sặc'
        ],
        response: "**Nếu sau khi bị sặc nước hoặc gặp sự cố dưới nước mà vẫn mệt bất thường, cần báo cho người lớn.**\n\n" +
                  "Đặc biệt nếu đi kèm ho, khó thở, khó chịu hoặc nhận thức bất thường thì nên được đưa đến cơ sở y tế kiểm tra."
    },

    {
        id: "abnormal_behavior_after_water",
        keywords: [
            'lơ mơ sau sặc nước',
            'lo mo sau boi',
            'không tỉnh táo sau bơi',
            'nhận thức bất thường',
            'sặc nước rồi lơ mơ'
        ],
        response: "**Lơ mơ hoặc nhận thức bất thường sau khi bị sặc nước là dấu hiệu cần được người lớn xử lý ngay.**\n\n" +
                  "Không để người đó tự đi về hoặc tiếp tục vui chơi.\n\n" +
                  "Hãy báo người lớn và đưa đến cơ sở y tế để được kiểm tra."
    },

    {
        id: "medical_check_after_water_symptoms",
        keywords: [
            'sặc nước có cần đi viện',
            'sac nuoc di vien',
            'khi nào đi bệnh viện',
            'sau đuối nước đi khám',
            'cần đến cơ sở y tế không'
        ],
        response: "**Nếu sau khi bơi hoặc sặc nước có triệu chứng bất thường, cần đến cơ sở y tế kiểm tra.**\n\n" +
                  "Các dấu hiệu tài liệu nêu gồm **mệt mỏi, khó thở, ho, khó chịu hoặc nhận thức bất thường**.\n\n" +
                  "Em hãy báo ngay cho bố mẹ, thầy cô hoặc người lớn nếu bản thân hoặc bạn có những biểu hiện này."
    },

    {
        id: "comfort_drowning_person_after_rescue",
        keywords: [
            'trấn an người bị đuối',
            'tran an nan nhan',
            'người bị đuối sợ hãi',
            'cứu lên khóc',
            'nói gì sau khi cứu'
        ],
        response: "**Sau khi đưa người gặp nạn lên nơi an toàn, hãy giúp họ bình tĩnh.**\n\n" +
                  "Có thể nói nhẹ nhàng rằng đã có người giúp và bảo họ nghỉ tại chỗ.\n\n" +
                  "Đồng thời gọi người lớn đến kiểm tra tình trạng và bảo vệ họ khỏi những nguy cơ khác."
    },

    {
        id: "first_aid_scene_safety",
        keywords: [
            'hiện trường an toàn',
            'hien truong an toan',
            'sơ cứu ở đâu',
            'đưa người ra chỗ an toàn',
            'nơi sơ cứu'
        ],
        response: "**Trước khi sơ cấp cứu, cần bảo đảm khu vực xung quanh an toàn.**\n\n" +
                  "Không sơ cứu ở vị trí mà bản thân người cứu có thể tiếp tục rơi xuống nước hoặc gặp nguy hiểm.\n\n" +
                  "Sau khi người gặp nạn được đưa khỏi nơi nguy hiểm, hãy gọi trợ giúp và tiến hành các bước phù hợp."
    },

    {
        id: "first_aid_time_is_important",
        keywords: [
            'cấp cứu có cần nhanh không',
            'cap cuu nhanh',
            'thời gian cấp cứu',
            'có được chờ không',
            'chậm sơ cứu có sao không'
        ],
        response: "**Trong sơ cấp cứu, thời gian rất quan trọng.**\n\n" +
                  "Nếu người gặp nạn bất tỉnh hoặc không thở, không nên mất thời gian vào những việc không cần thiết như xốc nước.\n\n" +
                  "Hãy gọi người trợ giúp và cấp cứu **115** càng sớm càng tốt."
    },

    {
        id: "first_aid_summary_for_children",
        keywords: [
            'nhớ gì sau khi cứu người',
            'quy tac so cuu',
            'tóm tắt sơ cứu',
            'lên bờ phải nhớ gì',
            'sơ cứu đuối nước nhớ gì'
        ],
        response: "**Sau khi người gặp nạn được đưa lên bờ, em hãy nhớ:**\n\n" +
                  "1. **Đưa đến nơi an toàn.**\n" +
                  "2. **Gọi người lớn và kiểm tra phản ứng.**\n" +
                  "3. Nếu nghiêm trọng, **gọi 115 ngay.**\n" +
                  "4. **Không xốc nước, không dốc ngược người gặp nạn.**\n" +
                  "5. Kỹ thuật CPR chỉ thực hiện theo kỹ năng đã được học và hướng dẫn.\n" +
                  "6. Nếu sau sặc nước có ho, khó thở, mệt hoặc lơ mơ, cần đến cơ sở y tế.\n\n" +
                  "Câu dễ nhớ: **An toàn – Gọi người lớn – Gọi 115 – Không xốc nước.**"
    },
{
        id: "flood_safety_general",
        keywords: [
            'an toàn mùa lũ',
            'nuoc lu',
            'ngập lụt',
            'mưa lũ',
            'phòng đuối nước khi lũ',
            'trời lụt làm gì'
        ],
        response: "**Khi có mưa lớn, ngập lụt hoặc nước lũ, em cần đặc biệt cẩn thận.**\n\n" +
                  "Không tự ý đi vào vùng nước ngập, không chơi đùa trong nước lũ và không cố đi qua nơi có dòng nước chảy mạnh.\n\n" +
                  "Nước lũ thường đục nên em không nhìn thấy hố sâu, cống, vật sắc nhọn hoặc những nguy hiểm bên dưới.\n\n" +
                  "Hãy ở nơi an toàn, đi cùng người lớn và làm theo hướng dẫn của gia đình, nhà trường và chính quyền địa phương."
    },

    {
        id: "do_not_enter_flood_water",
        keywords: [
            'có được đi vào nước lũ không',
            'di vao nuoc lu',
            'lội nước ngập',
            'xuống nước lũ',
            'đi qua vùng ngập'
        ],
        response: "**Không nên đi vào vùng nước lũ hoặc vùng ngập.**\n\n" +
                  "Ngay cả khi nước nhìn có vẻ nông, bên dưới vẫn có thể có hố sâu, cống bị mất nắp, vật sắc nhọn hoặc dòng nước mạnh.\n\n" +
                  "Cách an toàn nhất là tránh nước lũ và tìm đường hoặc nơi trú an toàn."
    },

    {
        id: "flood_water_shallow_still_dangerous",
        keywords: [
            'nước lũ cạn có nguy hiểm không',
            'nuoc can co nguy hiem',
            'ngập ít có đi được không',
            'nước lũ thấp',
            'nước chỉ tới chân'
        ],
        response: "**Nước lũ nhìn cạn vẫn có thể nguy hiểm.**\n\n" +
                  "Dòng nước chảy mạnh có thể làm em mất thăng bằng, trong khi nước đục khiến em không nhìn thấy hố, cống hoặc vật nằm dưới chân.\n\n" +
                  "Vì vậy, không nên tự lội qua chỉ vì thấy mực nước thấp."
    },

    {
        id: "flood_fast_current",
        keywords: [
            'nước lũ chảy xiết',
            'nuoc lu chay manh',
            'dòng lũ mạnh',
            'nước ngập chảy nhanh',
            'lũ cuốn'
        ],
        response: "**Tuyệt đối không đi vào vùng nước lũ đang chảy xiết.**\n\n" +
                  "Dòng nước mạnh có thể cuốn trôi cả cây cối, xe và các vật lớn, nên trẻ em càng dễ bị mất thăng bằng và cuốn đi.\n\n" +
                  "Hãy tránh xa và chờ người lớn hoặc lực lượng có trách nhiệm hướng dẫn."
    },

    {
        id: "flood_water_is_murky",
        keywords: [
            'nước lũ đục',
            'nuoc ngap duc',
            'không thấy đáy',
            'nước đục nguy hiểm',
            'đường ngập không thấy gì'
        ],
        response: "**Nước lũ thường đục nên rất khó nhìn thấy nguy hiểm bên dưới.**\n\n" +
                  "Có thể có hố sâu, cống, vật sắc nhọn hoặc chỗ trũng mà em không thể nhận ra bằng mắt.\n\n" +
                  "Vì vậy, không nên dùng chân để dò đường hoặc tự đi vào vùng nước đục."
    },

    {
        id: "open_manhole_flood_risk",
        keywords: [
            'hố ga ngập nước',
            'ho ga mat nap',
            'cống ngập',
            'cống không nắp khi mưa',
            'miệng cống dưới nước',
            'hố ga bị che'
        ],
        response: "**Hố ga hoặc cống bị ngập là một nguy cơ rất lớn khi trời mưa to.**\n\n" +
                  "Nước ngập có thể che kín miệng cống hoặc hố ga bị mất nắp nên em không thể nhìn thấy.\n\n" +
                  "Nếu bước vào đó, em có thể bị rơi xuống hoặc bị dòng nước cuốn.\n\n" +
                  "Không đi qua vùng nước ngập khi không biết rõ bên dưới có gì."
    },

    {
        id: "street_flood_manhole",
        keywords: [
            'đường ngập có hố ga',
            'duong ngap ho ga',
            'đi trên phố ngập',
            'mưa to đường ngập',
            'hố ga ngoài đường'
        ],
        response: "**Khi đường phố bị ngập, em cần đề phòng hố ga và cống thoát nước bị che khuất.**\n\n" +
                  "Nắp cống có thể bị hỏng hoặc bị nước cuốn đi mà em không nhìn thấy.\n\n" +
                  "Không tự lội qua đường ngập; hãy tìm nơi an toàn và chờ người lớn hỗ trợ."
    },

    {
        id: "sharp_objects_in_flood_water",
        keywords: [
            'vật nhọn dưới nước',
            'vat sac trong nuoc lu',
            'dẫm phải đồ dưới nước',
            'rác dưới nước ngập',
            'đi chân trong nước lũ'
        ],
        response: "**Trong nước lũ có thể có nhiều vật nguy hiểm mà em không nhìn thấy.**\n\n" +
                  "Ví dụ như mảnh kim loại, vật sắc nhọn, nắp cống hoặc đồ vật bị nước cuốn trôi.\n\n" +
                  "Những vật này có thể làm em bị thương hoặc mắc chân.\n\n" +
                  "Vì vậy, hãy tránh đi vào nước lũ."
    },

    {
        id: "electric_shock_flood_water",
        keywords: [
            'điện dưới nước ngập',
            'dien giat nuoc lu',
            'nước ngập có điện không',
            'dây điện trong nước',
            'điện giật khi ngập'
        ],
        response: "**Nước ngập có thể có nguy cơ điện giật.**\n\n" +
                  "Điện có thể truyền qua nước nếu có dây điện hoặc thiết bị điện bị hỏng, rò điện.\n\n" +
                  "Em không nên đến gần dây điện, cột điện hoặc vùng nước nghi có điện.\n\n" +
                  "Hãy báo ngay cho người lớn và tránh xa khu vực đó."
    },

    {
        id: "flooded_home_electricity",
        keywords: [
            'nhà ngập có điện',
            'nha ngap dien',
            'ổ điện bị ngập',
            'nước vào nhà có nguy hiểm không',
            'điện khi nhà ngập'
        ],
        response: "**Nếu nhà bị ngập, điện là một nguy cơ rất nguy hiểm.**\n\n" +
                  "Tài liệu lưu ý cần chú ý ngắt các nguồn điện khi nhà bị ngập.\n\n" +
                  "Trẻ em không được tự chạm vào ổ cắm, dây điện hoặc thiết bị điện đang ở gần nước.\n\n" +
                  "Hãy để người lớn xử lý."
    },

    {
        id: "flood_life_jacket",
        keywords: [
            'lũ có cần áo phao',
            'ao phao mua lu',
            'gần nước lũ mặc gì',
            'đi qua vùng lũ cần áo phao',
            'áo phao khi ngập'
        ],
        response: "**Khi buộc phải ở gần vùng nước lũ, áo phao là thiết bị an toàn rất quan trọng.**\n\n" +
                  "Tài liệu khuyến cáo khi ở trong hoặc gần vùng nước lũ nên mặc áo phao để phòng trường hợp bất ngờ rơi xuống nước.\n\n" +
                  "Tuy nhiên, mặc áo phao không có nghĩa là em được tự ý đi vào vùng nước lũ."
    },

    {
        id: "follow_local_flood_instructions",
        keywords: [
            'nghe ai khi có lũ',
            'huong dan mua lu',
            'chính quyền báo lũ',
            'lũ phải nghe ai',
            'cảnh báo lũ'
        ],
        response: "**Khi có lũ lụt, em cần làm theo hướng dẫn của người lớn và chính quyền địa phương.**\n\n" +
                  "Không tự ý đi sang nơi khác hoặc làm theo lời rủ rê của bạn bè.\n\n" +
                  "Các hướng dẫn sơ tán, đường đi an toàn và khu vực nguy hiểm cần được tuân thủ nghiêm túc."
    },

    {
        id: "school_trip_home_storm_flood",
        keywords: [
            'đi học về gặp lũ',
            'di hoc ve gap mua',
            'tan học gặp ngập',
            'đường về bị lụt',
            'đang về nhà gặp mưa giông'
        ],
        response: "**Nếu trên đường đi học về gặp lụt hoặc mưa giông, em không nên cố tiếp tục đi qua vùng nguy hiểm.**\n\n" +
                  "Theo tài liệu, em nên **quay lại trường hoặc tìm nơi trú an toàn gần nhất**.\n\n" +
                  "Sau đó nhờ người lớn gọi bố mẹ hoặc người chăm sóc đến đón."
    },

    {
        id: "return_to_school_when_flooded",
        keywords: [
            'đường ngập có quay lại trường không',
            'quay lai truong khi mua',
            'không về nhà được vì lũ',
            'tan học đường ngập',
            'mưa lũ quay lại đâu'
        ],
        response: "**Có. Nếu đường về nhà bị ngập hoặc có mưa giông nguy hiểm, quay lại trường là một lựa chọn an toàn theo hướng dẫn trong tài liệu.**\n\n" +
                  "Nếu không thể quay lại trường, hãy tìm chỗ trú an toàn gần nhất và nhờ người lớn liên hệ với gia đình."
    },

    {
        id: "find_safe_shelter_storm",
        keywords: [
            'trú mưa ở đâu',
            'tim cho tru an toan',
            'gặp mưa giông trú đâu',
            'lụt thì trú đâu',
            'chỗ an toàn khi mưa'
        ],
        response: "**Khi gặp mưa giông hoặc ngập lụt trên đường, em cần tìm nơi trú an toàn.**\n\n" +
                  "Tài liệu khuyến cáo quay lại trường hoặc tìm chỗ trú an toàn gần nhất rồi nhờ người gọi gia đình đến đón.\n\n" +
                  "Không trú ở ngay sát sông, suối, cống, hố nước hoặc vùng đang bị ngập."
    },

    {
        id: "call_parents_when_flooded",
        keywords: [
            'gặp lũ gọi bố mẹ',
            'goi bo me mua lu',
            'đường về ngập gọi ai',
            'nhờ gọi gia đình',
            'mưa lớn không về được'
        ],
        response: "**Nếu mưa lũ làm em không thể về nhà an toàn, hãy nhờ người lớn liên hệ với bố mẹ hoặc người chăm sóc.**\n\n" +
                  "Em nên ở yên tại trường hoặc nơi trú an toàn cho đến khi có người đến đón.\n\n" +
                  "Không tự ý tìm đường khác qua vùng ngập."
    },

    {
        id: "do_not_play_in_floodwater",
        keywords: [
            'chơi nước ngập',
            'choi nuoc mua',
            'tắm nước lũ',
            'nghịch nước ngập',
            'bơi ngoài đường ngập'
        ],
        response: "**Không được chơi, tắm hoặc nghịch trong nước lũ và nước ngập.**\n\n" +
                  "Nước có thể chảy mạnh, che hố sâu, cống hoặc vật sắc nhọn và còn có nguy cơ điện giật.\n\n" +
                  "Hãy chọn khu vực khô ráo, an toàn để vui chơi."
    },

    {
        id: "do_not_cross_flooded_road",
        keywords: [
            'qua đường ngập',
            'di qua duong ngap',
            'lội qua đường lũ',
            'đường ngập có đi qua không',
            'băng qua nước lũ'
        ],
        response: "**Không nên tự băng qua đường đang ngập.**\n\n" +
                  "Em khó biết đoạn đường có bị sụt, có hố ga mở hay dòng nước mạnh hay không.\n\n" +
                  "Hãy dừng lại ở nơi an toàn và nhờ người lớn hỗ trợ."
    },

    {
        id: "flood_current_can_move_objects",
        keywords: [
            'lũ cuốn được gì',
            'nuoc lu cuon xe',
            'dòng lũ mạnh cỡ nào',
            'lũ cuốn cây',
            'nước lũ có mạnh không'
        ],
        response: "**Nước lũ chảy mạnh có thể cuốn cả cây cối, ô tô và các vật lớn.**\n\n" +
                  "Điều đó cho thấy sức nước rất mạnh và trẻ em không thể chống lại bằng sức của mình.\n\n" +
                  "Vì vậy, tuyệt đối tránh xa dòng nước đang chảy xiết."
    },

    {
        id: "flood_move_only_when_instructed",
        keywords: [
            'có nên tự sơ tán không',
            'tu di khi lu',
            'lũ có tự đi nơi khác không',
            'di chuyển khi lũ',
            'sơ tán thế nào'
        ],
        response: "**Khi có lũ, em không nên tự ý di chuyển một mình.**\n\n" +
                  "Hãy đi cùng gia đình, thầy cô hoặc người có trách nhiệm và làm theo hướng dẫn sơ tán.\n\n" +
                  "Tài liệu lưu ý cần xác định đường đến nơi an toàn và hạn chế di chuyển trên vùng nước, đặc biệt ở nơi nước chảy xiết."
    },

    {
        id: "avoid_large_flooded_areas",
        keywords: [
            'cánh đồng ngập',
            'song lon mua lu',
            'đi qua đồng ngập',
            'vùng nước rộng',
            'khu ngập lớn'
        ],
        response: "**Không nên tự di chuyển qua sông lớn, cánh đồng rộng bị ngập hoặc vùng nước chảy mạnh.**\n\n" +
                  "Những nơi này khó xác định độ sâu, hướng dòng chảy và rất khó được trợ giúp nếu xảy ra sự cố.\n\n" +
                  "Hãy ở cùng người lớn và đi theo tuyến đường an toàn được hướng dẫn."
    },

    {
        id: "flood_children_supervision",
        keywords: [
            'trẻ em khi có lũ',
            'tre em mua lu',
            'lũ có cần người lớn trông',
            'trông trẻ mùa lũ',
            'bé ở vùng ngập'
        ],
        response: "**Khi có lũ, trẻ em cần được người lớn trông nom chặt chẽ hơn bình thường.**\n\n" +
                  "Nước có thể dâng nhanh và tạo thêm nhiều khu vực nguy hiểm quanh nhà hoặc nơi sơ tán.\n\n" +
                  "Em không nên tự ý rời khỏi chỗ ở an toàn hoặc đi chơi gần nước."
    },

    {
        id: "flood_emergency_float_items",
        keywords: [
            'vật nổi mùa lũ',
            'phao mua lu',
            'can nhựa khi lũ',
            'chuẩn bị gì khi lũ',
            'dụng cụ nổi mùa lũ'
        ],
        response: "**Tài liệu khuyến cáo gia đình ở vùng lũ nên chuẩn bị các phương tiện nổi và cứu sinh như áo phao, phao cứu sinh hoặc can nhựa phù hợp.**\n\n" +
                  "Những vật này dùng để hỗ trợ an toàn khi thật sự cần thiết.\n\n" +
                  "Trẻ em không nên lấy các dụng cụ cứu sinh ra chơi."
    },

    {
        id: "flood_water_health_risk",
        keywords: [
            'nước lũ bẩn',
            'nuoc lu co ban khong',
            'nước ngập có hại',
            'lội nước lũ có sao không',
            'nước lũ có bệnh không'
        ],
        response: "**Tài liệu khuyến cáo tránh nước lũ ngay cả khi nước không chảy.**\n\n" +
                  "Ngoài nguy cơ đuối nước, nước lũ còn có thể gây hại cho sức khỏe và có nhiều vật nguy hiểm bên dưới.\n\n" +
                  "Vì vậy, em không nên tự lội hoặc nghịch trong nước ngập."
    },

    {
        id: "flood_safety_summary",
        keywords: [
            'nhớ gì khi có lũ',
            'quy tac mua lu',
            'an toàn khi ngập',
            'tóm tắt mùa lũ',
            'gặp nước lũ làm gì'
        ],
        response: "**Khi có mưa lớn, ngập lụt hoặc nước lũ, em hãy nhớ:**\n\n" +
                  "1. **Không đi vào nước lũ.**\n" +
                  "2. **Không chơi hoặc bơi trong nước ngập.**\n" +
                  "3. Đề phòng **hố ga, cống, hố sâu và vật sắc nhọn bị nước che khuất.**\n" +
                  "4. Tránh xa **dây điện và khu vực có nguy cơ điện giật.**\n" +
                  "5. Nếu trên đường đi học về gặp lũ, **quay lại trường hoặc tìm nơi trú an toàn và nhờ gọi gia đình.**\n" +
                  "6. Làm theo hướng dẫn của người lớn và chính quyền địa phương.\n\n" +
                  "Câu dễ nhớ: **Không lội – Không chơi – Tránh điện – Tìm nơi an toàn.**"
    },
{
        id: "bad_weather_swimming_general",
        keywords: [
            'thời tiết xấu có bơi không',
            'troi xau co boi khong',
            'mưa gió đi bơi',
            'giông sét đi bơi',
            'trời xấu xuống nước'
        ],
        response: "**Không nên bơi hoặc lội khi thời tiết đang xấu hoặc có dấu hiệu sắp xấu đi.**\n\n" +
                  "Các tình huống như mưa to, gió lớn, giông hoặc sấm sét đều không phù hợp để tiếp tục hoạt động dưới nước.\n\n" +
                  "Nếu thời tiết thay đổi khi em đang bơi, hãy làm theo hướng dẫn của người lớn hoặc giáo viên và ra khỏi nước để đến nơi an toàn."
    },

    {
        id: "swimming_in_rain",
        keywords: [
            'mưa có bơi được không',
            'mua co boi khong',
            'bơi lúc trời mưa',
            'đang mưa đi bơi',
            'tắm mưa dưới hồ'
        ],
        response: "**Không nên tiếp tục bơi khi trời mưa, đặc biệt là ở bể bơi ngoài trời hoặc vùng nước tự nhiên.**\n\n" +
                  "Tài liệu quy định không bơi, lội khi thời tiết đang hoặc sắp chuyển xấu.\n\n" +
                  "Nếu trời bắt đầu mưa khi em đang ở dưới nước, hãy nghe hướng dẫn của giáo viên hoặc người lớn và ra khỏi nước."
    },

    {
        id: "swimming_in_thunderstorm",
        keywords: [
            'giông có bơi không',
            'giong co boi khong',
            'trời giông đi bơi',
            'bơi lúc có giông',
            'giông bão xuống nước'
        ],
        response: "**Không được bơi, lội khi có giông.**\n\n" +
                  "Giông là dấu hiệu thời tiết xấu và có thể đi kèm mưa lớn, gió mạnh hoặc sấm sét.\n\n" +
                  "Em cần rời khu vực nước và đến nơi an toàn theo hướng dẫn của người lớn."
    },

    {
        id: "swimming_when_lightning",
        keywords: [
            'sét có bơi được không',
            'set co boi khong',
            'có sét đi bơi',
            'bơi khi có sét',
            'sấm sét dưới nước'
        ],
        response: "**Khi có sấm sét, không được tiếp tục bơi hoặc lội.**\n\n" +
                  "Tài liệu xếp sấm sét vào nhóm thời tiết xấu mà học sinh không được bơi, lội.\n\n" +
                  "Hãy ra khỏi nước và làm theo hướng dẫn của giáo viên, nhân viên bể bơi hoặc người lớn."
    },

    {
        id: "swimming_when_thunder",
        keywords: [
            'nghe sấm có bơi không',
            'nghe sam khi boi',
            'đang bơi nghe sấm',
            'có tiếng sấm',
            'sấm rồi có bơi tiếp'
        ],
        response: "**Nếu đang bơi mà nghe thấy sấm, em không nên tiếp tục bơi.**\n\n" +
                  "Sấm là dấu hiệu thời tiết đã hoặc đang chuyển xấu.\n\n" +
                  "Hãy ra khỏi nước, tập trung cùng người lớn hoặc giáo viên và làm theo hướng dẫn an toàn."
    },

    {
        id: "swimming_in_strong_wind",
        keywords: [
            'gió to có bơi không',
            'gio lon di boi',
            'đang bơi gió mạnh',
            'bơi lúc gió lớn',
            'trời gió to'
        ],
        response: "**Không nên bơi ở bể ngoài trời khi có gió to.**\n\n" +
                  "Nội quy lớp học bơi trong tài liệu quy định không bơi ngoài trời khi thời tiết xấu như mưa, gió to hoặc sấm sét.\n\n" +
                  "Nếu gió mạnh xuất hiện khi đang bơi, hãy ra khỏi nước theo hướng dẫn của người phụ trách."
    },

    {
        id: "weather_about_to_turn_bad",
        keywords: [
            'trời sắp mưa có bơi không',
            'sap mua co boi khong',
            'trời sắp giông',
            'mây đen đi bơi',
            'thời tiết sắp xấu'
        ],
        response: "**Không cần đợi đến khi mưa to mới dừng bơi.**\n\n" +
                  "Tài liệu quy định không bơi, lội cả khi thời tiết **đang hoặc sắp chuyển xấu**.\n\n" +
                  "Nếu người lớn, giáo viên hoặc nhân viên cứu hộ yêu cầu dừng bơi vì thời tiết, em cần lên bờ ngay."
    },

    {
        id: "weather_changes_while_swimming",
        keywords: [
            'đang bơi trời đổi',
            'dang boi troi mua',
            'đang bơi gặp giông',
            'đang bơi có sấm',
            'mưa bất ngờ khi bơi'
        ],
        response: "**Nếu thời tiết bất ngờ xấu đi khi em đang bơi, không nên cố bơi tiếp.**\n\n" +
                  "Hãy bình tĩnh, di chuyển đến lối lên bờ an toàn và làm theo hướng dẫn của giáo viên hoặc người lớn.\n\n" +
                  "Sau khi ra khỏi nước, đến khu vực an toàn và không tự ý quay lại bơi khi thời tiết chưa bảo đảm."
    },

    {
        id: "leave_water_bad_weather",
        keywords: [
            'khi nào phải lên bờ',
            'len bo khi mua',
            'mưa thì ra khỏi nước',
            'có sấm phải lên không',
            'dừng bơi khi nào'
        ],
        response: "**Khi xuất hiện mưa to, gió lớn, giông hoặc sấm sét, em cần dừng hoạt động dưới nước.**\n\n" +
                  "Hãy lên bờ bằng lối an toàn và nghe hướng dẫn của người quản lý, giáo viên hoặc người lớn.\n\n" +
                  "Không nên nán lại dưới nước để chơi thêm."
    },

    {
        id: "do_not_wait_for_heavy_rain",
        keywords: [
            'chưa mưa to có bơi được không',
            'chua mua co boi khong',
            'mới có giông thôi',
            'mưa nhỏ vẫn bơi',
            'chưa có mưa lớn'
        ],
        response: "**Không nên chờ đến khi thời tiết trở nên rất xấu mới dừng bơi.**\n\n" +
                  "Nguyên tắc trong tài liệu là không bơi, lội khi thời tiết **đang hoặc sắp chuyển xấu**.\n\n" +
                  "Nếu có cảnh báo hoặc người lớn yêu cầu lên bờ, em cần thực hiện ngay."
    },

    {
        id: "outdoor_pool_bad_weather",
        keywords: [
            'hồ bơi ngoài trời mưa',
            'be boi ngoai troi mua',
            'bể bơi ngoài trời có sét',
            'gió to ở hồ bơi',
            'mưa ở bể bơi'
        ],
        response: "**Bể bơi ngoài trời không nên tổ chức bơi khi thời tiết xấu.**\n\n" +
                  "Tài liệu nêu rõ không bơi ở bể ngoài trời khi có mưa, gió to hoặc sấm sét.\n\n" +
                  "Em cần nghiêm chỉnh làm theo nội quy của bể bơi và hướng dẫn của giáo viên."
    },

    {
        id: "follow_swimming_teacher_bad_weather",
        keywords: [
            'thầy bảo dừng bơi',
            'giao vien bao len bo',
            'huấn luyện viên cho nghỉ',
            'cứu hộ yêu cầu lên bờ',
            'có phải nghe thầy không'
        ],
        response: "**Có. Khi giáo viên, huấn luyện viên hoặc người phụ trách yêu cầu dừng bơi, em cần thực hiện ngay.**\n\n" +
                  "Họ có trách nhiệm theo dõi điều kiện an toàn, trong đó có thời tiết.\n\n" +
                  "Không tự ý quay xuống nước khi chưa được phép."
    },

    {
        id: "storm_on_way_home",
        keywords: [
            'đi học về gặp giông',
            'di hoc ve gap giong',
            'tan học gặp mưa giông',
            'đường về có giông',
            'mưa giông trên đường'
        ],
        response: "**Nếu trên đường đi học về gặp mưa giông, em không nên cố đi tiếp qua khu vực nguy hiểm.**\n\n" +
                  "Theo tài liệu, em nên quay lại trường hoặc tìm chỗ trú an toàn gần nhất.\n\n" +
                  "Sau đó nhờ người lớn gọi bố mẹ hoặc người chăm sóc đến đón."
    },

    {
        id: "safe_shelter_during_storm",
        keywords: [
            'mưa giông trú đâu',
            'tru dau khi giong',
            'gặp giông tìm chỗ nào',
            'chỗ trú an toàn',
            'mưa to trú ở đâu'
        ],
        response: "**Khi gặp mưa giông trên đường, hãy tìm chỗ trú an toàn gần nhất.**\n\n" +
                  "Nếu đang trên đường đi học về, tài liệu khuyến cáo có thể quay lại trường hoặc tìm nơi trú an toàn rồi nhờ người gọi gia đình đến đón.\n\n" +
                  "Không tự ý tiếp tục đi qua khu vực ngập hoặc vùng nước nguy hiểm."
    },

    {
        id: "do_not_play_near_water_in_storm",
        keywords: [
            'mưa giông chơi gần ao',
            'choi gan song khi mua',
            'giông chơi gần hồ',
            'mưa to ra bờ sông',
            'trời giông gần nước'
        ],
        response: "**Khi thời tiết xấu, em không nên chơi ở gần ao, hồ, sông, suối hoặc các vùng nước mở.**\n\n" +
                  "Tài liệu yêu cầu học sinh luôn cẩn thận khi vui chơi gần vùng nước và không bơi, lội khi có mưa to, giông hoặc sét.\n\n" +
                  "Hãy vào nơi an toàn và chờ thời tiết ổn định."
    },

    {
        id: "bad_weather_swimming_summary",
        keywords: [
            'nhớ gì khi trời mưa',
            'quy tac troi xau',
            'mưa giông khi bơi',
            'tóm tắt thời tiết xấu',
            'trời xấu phải làm gì'
        ],
        response: "**Khi thời tiết xấu, em hãy nhớ:**\n\n" +
                  "1. **Không bơi, lội khi mưa to, giông, sét hoặc gió lớn.**\n" +
                  "2. Nếu đang bơi mà thời tiết xấu đi, **ra khỏi nước theo hướng dẫn**.\n" +
                  "3. Không tự quay lại bơi khi chưa được phép.\n" +
                  "4. Nếu gặp mưa giông trên đường đi học về, **quay lại trường hoặc tìm nơi trú an toàn và nhờ gọi gia đình**.\n\n" +
                  "Câu dễ nhớ: **Trời xấu – Không xuống nước – Đang bơi thì lên bờ.**"
    },
{
        id: "pool_rules_general",
        keywords: [
            'nội quy bể bơi',
            'noi quy be boi',
            'đi hồ bơi cần nhớ gì',
            'quy tắc hồ bơi',
            'ở bể bơi phải làm gì'
        ],
        response: "**Khi đến bể bơi, em cần đọc và thực hiện đúng nội quy.**\n\n" +
                  "Nội quy thường cho biết giờ tập luyện, khu vực được phép bơi, khu vực nguy hiểm và những việc không được làm.\n\n" +
                  "Em cần khởi động trước khi xuống nước, bơi đúng khu vực, không tự ý nhảy xuống nơi không được phép và luôn nghe hướng dẫn của giáo viên hoặc nhân viên phụ trách."
    },

    {
        id: "read_pool_signs",
        keywords: [
            'đọc biển ở hồ bơi',
            'bien bao be boi',
            'biển ở bể bơi',
            'cần xem biển gì',
            'biển báo hồ bơi'
        ],
        response: "**Trước khi xuống nước, em nên quan sát các biển báo tại bể bơi.**\n\n" +
                  "Biển báo giúp em biết nơi nào dành cho người chưa biết bơi, nơi nào dành cho người biết bơi và khu vực nào cấm nhảy.\n\n" +
                  "Không nên bỏ qua biển báo chỉ vì thấy những bạn khác đang xuống nước."
    },

    {
        id: "non_swimmer_pool_area",
        keywords: [
            'chưa biết bơi ở đâu',
            'khong biet boi o dau',
            'khu người chưa biết bơi',
            'không biết bơi xuống đâu',
            'bể cho người chưa biết bơi'
        ],
        response: "**Người chưa biết bơi cần ở đúng khu vực dành cho người chưa biết bơi.**\n\n" +
                  "Theo tài liệu, khu vực này có độ sâu từ **1 mét trở xuống** và cần có biển báo rõ ràng.\n\n" +
                  "Em không được tự ý sang khu vực nước sâu chỉ vì muốn thử sức hoặc đi theo bạn."
    },

    {
        id: "non_swimmer_deep_area",
        keywords: [
            'chưa biết bơi xuống chỗ sâu',
            'khong biet boi xuong sau',
            'không biết bơi vào bể sâu',
            'chưa biết bơi sang khu sâu',
            'nước sâu khi chưa biết bơi'
        ],
        response: "**Nếu chưa biết bơi, em không được tự ý xuống khu vực nước sâu.**\n\n" +
                  "Ở chỗ sâu, em có thể không chạm chân xuống đáy và dễ hoảng loạn nếu mất thăng bằng.\n\n" +
                  "Hãy ở đúng khu vực dành cho người chưa biết bơi và làm theo hướng dẫn của giáo viên."
    },

    {
        id: "swimmer_designated_area",
        keywords: [
            'khu người biết bơi',
            'khu vuc biet boi',
            'biết bơi ở khu nào',
            'bể dành cho người biết bơi',
            'chỗ người biết bơi'
        ],
        response: "**Bể bơi có thể phân riêng khu vực dành cho người đã biết bơi.**\n\n" +
                  "Nếu em đã biết bơi, vẫn phải bơi đúng khu vực được hướng dẫn và không tự ý vượt rào, dây phân làn hoặc sang khu vực cấm.\n\n" +
                  "Biết bơi không có nghĩa là được bỏ qua nội quy."
    },

    {
        id: "do_not_cross_pool_zone",
        keywords: [
            'qua khu vực khác',
            'vuot day phan lan',
            'sang bể sâu',
            'qua dây hồ bơi',
            'đổi khu bơi'
        ],
        response: "**Không nên tự ý đi sang khu vực khác của bể bơi khi chưa được phép.**\n\n" +
                  "Các khu vực được phân chia theo độ sâu và khả năng bơi để bảo đảm an toàn.\n\n" +
                  "Nếu muốn đổi khu vực, hãy hỏi giáo viên hoặc người phụ trách trước."
    },

    {
        id: "no_diving_sign",
        keywords: [
            'biển cấm nhảy',
            'cam nhay cam dau',
            'cấm lao đầu',
            'biển cấm cắm đầu',
            'chỗ cấm nhảy'
        ],
        response: "**Nếu thấy biển cấm nhảy cắm đầu, em tuyệt đối không được thực hiện động tác này.**\n\n" +
                  "Theo tài liệu, khu vực có độ sâu dưới **1,4 mét** phải có biển cấm nhảy cắm đầu.\n\n" +
                  "Nhảy xuống nước nông có thể gây chấn thương nghiêm trọng ở đầu, cổ hoặc lưng."
    },

    {
        id: "shallow_pool_dive_risk",
        keywords: [
            'nước nông có nhảy đầu được không',
            'nuoc nong nhay dau',
            'bể nông cắm đầu',
            'nhảy cắm đầu bể nông',
            'lao đầu chỗ nông'
        ],
        response: "**Không được nhảy cắm đầu xuống khu vực nước nông.**\n\n" +
                  "Nếu đáy bể ở quá gần, đầu hoặc cổ có thể va mạnh vào đáy.\n\n" +
                  "Chỉ thực hiện các động tác nhảy xuống nước khi có khu vực cho phép và có giáo viên hướng dẫn."
    },

    {
        id: "obey_pool_teacher",
        keywords: [
            'phải nghe giáo viên không',
            'nghe huan luyen vien',
            'thầy dạy bơi bảo gì',
            'nghe người hướng dẫn',
            'có phải nghe cứu hộ không'
        ],
        response: "**Có. Khi học bơi, em cần làm theo hướng dẫn của giáo viên hoặc huấn luyện viên.**\n\n" +
                  "Người hướng dẫn chịu trách nhiệm tổ chức lớp và theo dõi điều kiện an toàn.\n\n" +
                  "Không tự ý xuống nước, đổi khu vực, nhảy xuống bể hoặc tiếp tục bơi khi đã được yêu cầu dừng."
    },

    {
        id: "pool_emergency_instructions",
        keywords: [
            'bể bơi gặp sự cố',
            'su co be boi',
            'khẩn cấp ở hồ bơi',
            'có sự cố phải làm gì',
            'bể bơi báo động'
        ],
        response: "**Khi bể bơi xảy ra tình huống khẩn cấp, em cần giữ bình tĩnh và nghe hướng dẫn.**\n\n" +
                  "Tài liệu yêu cầu khu vực dạy bơi phải có hướng dẫn quy trình xử lý khi gặp tình huống nguy hiểm.\n\n" +
                  "Không chạy lung tung, chen lấn hoặc tự quay xuống nước. Hãy tập trung ở nơi được giáo viên hoặc nhân viên hướng dẫn."
    },

    {
        id: "pool_rescue_equipment",
        keywords: [
            'phao cứu sinh ở hồ',
            'sao cuu ho',
            'dụng cụ cứu hộ bể bơi',
            'bể bơi có phao không',
            'thiết bị cứu hộ'
        ],
        response: "**Bể bơi an toàn cần có các dụng cụ cứu hộ được bố trí ở vị trí dễ sử dụng.**\n\n" +
                  "Tài liệu nêu các thiết bị như phao cứu sinh, sào cứu hộ và ghế cứu hộ dành cho nhân viên cứu hộ.\n\n" +
                  "Học sinh không nên lấy các dụng cụ này ra chơi vì chúng cần sẵn sàng cho trường hợp khẩn cấp."
    },

    {
        id: "do_not_play_with_rescue_equipment",
        keywords: [
            'nghịch phao cứu sinh',
            'nghich sao cuu ho',
            'lấy phao cứu hộ chơi',
            'chơi đồ cứu hộ',
            'có được nghịch phao không'
        ],
        response: "**Không nên lấy phao cứu sinh, sào cứu hộ hoặc các thiết bị an toàn ra chơi.**\n\n" +
                  "Đây là những dụng cụ cần được giữ đúng vị trí để sử dụng ngay khi có sự cố.\n\n" +
                  "Nếu em thấy thiết bị bị di chuyển hoặc hỏng, hãy báo cho người phụ trách."
    },

    {
        id: "pool_floor_slippery",
        keywords: [
            'sàn hồ bơi trơn',
            'san be boi tron',
            'chạy quanh hồ bơi',
            'chạy cạnh bể',
            'trượt ở bể bơi'
        ],
        response: "**Khu vực xung quanh bể bơi có thể ướt và dễ trượt ngã.**\n\n" +
                  "Tài liệu yêu cầu sàn quanh bể phải phẳng và không trơn trượt, nhưng em vẫn cần đi cẩn thận.\n\n" +
                  "Không chạy, đuổi nhau hoặc xô đẩy sát mép bể."
    },

    {
        id: "pool_water_visibility",
        keywords: [
            'nước bể đục',
            'nuoc be boi duc',
            'không thấy đáy bể',
            'bể bơi nhìn không rõ đáy',
            'nước hồ bơi không trong'
        ],
        response: "**Bể bơi dành cho trẻ cần có nước trong để có thể nhìn thấy đáy.**\n\n" +
                  "Nếu nước quá đục hoặc không quan sát được đáy, em không nên tự ý xuống bơi.\n\n" +
                  "Hãy báo cho giáo viên hoặc người phụ trách."
    },

    {
        id: "child_pool_depth",
        keywords: [
            'bể trẻ em sâu bao nhiêu',
            'be tre em sau',
            'hồ bơi trẻ em',
            'độ sâu bể trẻ em',
            'bể cho trẻ nhỏ'
        ],
        response: "**Tài liệu yêu cầu bể dành cho trẻ phải có độ sâu phù hợp với trẻ.**\n\n" +
                  "Mức nước cần phù hợp để việc học bơi được tổ chức an toàn, đồng thời nước phải trong và nhìn thấy đáy.\n\n" +
                  "Em vẫn cần học và bơi dưới sự quản lý của giáo viên, không tự đánh giá rằng bể thấp là hoàn toàn an toàn."
    },

    {
        id: "pool_entry_using_ladder",
        keywords: [
            'xuống bể bằng thang',
            'xuong be bang cau thang',
            'cách xuống cầu thang hồ',
            'lên xuống thang bể bơi',
            'bám tay vịn hồ bơi'
        ],
        response: "**Khi xuống bể bằng cầu thang, em cần đi chậm và chắc chắn.**\n\n" +
                  "Theo tài liệu, hãy nhìn vào cầu thang, dùng hai tay nắm tay vịn hoặc giữ thăng bằng và bước từng bậc cẩn thận.\n\n" +
                  "Không nhảy qua các bậc hoặc chen lấn với bạn."
    },

    {
        id: "pool_exit_using_ladder",
        keywords: [
            'lên bờ bằng thang',
            'len khoi be bang thang',
            'lên cầu thang hồ bơi',
            'ra khỏi bể bằng thang',
            'cách lên bờ hồ'
        ],
        response: "**Khi lên khỏi bể bằng cầu thang, hãy bám chắc tay vịn và đi từng bước.**\n\n" +
                  "Vừa đi vừa quan sát bậc thang, không leo vội hoặc đẩy bạn phía trước.\n\n" +
                  "Sau khi lên bờ, đi chậm vì sàn có thể ướt."
    },

    {
        id: "pool_session_duration",
        keywords: [
            'học bơi bao lâu',
            'hoc boi bao nhieu phut',
            'bơi dưới nước bao lâu',
            'buổi bơi dài bao lâu',
            'thời gian học bơi'
        ],
        response: "**Theo tài liệu, một buổi dạy bơi cho học sinh tối đa 90 phút, trong đó thời gian ở dưới nước không quá 60 phút.**\n\n" +
                  "Thời gian học cần được giáo viên tổ chức phù hợp để tránh mệt và quá sức.\n\n" +
                  "Nếu em cảm thấy lạnh hoặc mệt trước khi hết buổi, hãy báo giáo viên và ra khỏi nước."
    },

    {
        id: "pool_noon_training",
        keywords: [
            '11 giờ có nên bơi',
            '12 gio di boi',
            'bơi buổi trưa',
            '11h 13h bơi',
            'học bơi giữa trưa'
        ],
        response: "**Theo nội quy trong tài liệu, không nên tổ chức học và tập bơi trong khoảng 11 giờ đến 13 giờ.**\n\n" +
                  "Khi tham gia lớp bơi, em nên học đúng thời gian do giáo viên và đơn vị tổ chức quy định."
    },

    {
        id: "pool_no_food_during_training",
        keywords: [
            'ăn khi học bơi',
            'an truoc khi boi',
            'uống khi đang bơi',
            'ăn trong giờ bơi',
            'vừa ăn vừa học bơi'
        ],
        response: "**Nội quy lớp học bơi trong tài liệu yêu cầu ngay trước và trong khi bơi không ăn, uống.**\n\n" +
                  "Em nên thực hiện đúng hướng dẫn của giáo viên để tránh sặc, khó chịu hoặc mất an toàn trong lúc tập."
    },

    {
        id: "pool_rules_summary",
        keywords: [
            'nhớ gì ở hồ bơi',
            'quy tac be boi',
            'tóm tắt nội quy hồ bơi',
            'đi bể bơi nhớ gì',
            'nội quy bơi dễ nhớ'
        ],
        response: "**Khi ở bể bơi, em hãy nhớ:**\n\n" +
                  "1. **Đọc biển báo và nội quy.**\n" +
                  "2. **Bơi đúng khu vực phù hợp khả năng.**\n" +
                  "3. **Không nhảy cắm đầu ở nơi cấm.**\n" +
                  "4. **Không tự ý sang khu vực nước sâu.**\n" +
                  "5. **Không chạy, xô đẩy quanh bể.**\n" +
                  "6. **Làm theo giáo viên, huấn luyện viên và nhân viên cứu hộ.**\n\n" +
                  "Câu dễ nhớ: **Đọc biển – Đúng khu – Không nhảy – Nghe hướng dẫn.**"
    },
{
        id: "safe_swimming_definition",
        keywords: [
            'biết bơi an toàn là gì',
            'biet boi an toan',
            'thế nào là bơi an toàn',
            'bơi an toàn là sao',
            'biết bơi thế nào mới an toàn'
        ],
        response: "**Biết bơi an toàn không chỉ là biết một vài kiểu bơi.**\n\n" +
                  "Theo tài liệu, học sinh cần có cả kiến thức phòng tránh đuối nước, kỹ năng bơi, kỹ năng tự cứu và kỹ năng cứu đuối gián tiếp.\n\n" +
                  "Ở cấp độ ban đầu, em cần biết lên xuống bể an toàn, bơi được ít nhất 25 mét, nổi ngửa và đứng nước đủ thời gian, đồng thời biết xử lý khi bất ngờ rơi xuống nước."
    },

    {
        id: "swimming_25m_meaning",
        keywords: [
            'bơi 25m là gì',
            'boi duoc 25m',
            '25 mét có biết bơi chưa',
            'bơi 25m có đủ không',
            '25m bơi'
        ],
        response: "**Theo tài liệu, bơi được ít nhất 25 mét được coi là mức biết bơi ban đầu.**\n\n" +
                  "Tuy nhiên, chỉ bơi được 25 mét chưa có nghĩa là em hoàn toàn an toàn trong mọi môi trường nước.\n\n" +
                  "Em vẫn cần biết nổi ngửa, đứng nước, tự cứu, nhận biết nơi nguy hiểm và tuân thủ các quy tắc an toàn."
    },

    {
        id: "safe_swimming_level_one",
        keywords: [
            'cấp độ 1 bơi',
            'cap do 1 boi',
            'bơi an toàn cấp 1',
            'tiêu chuẩn cấp 1',
            'biết bơi ban đầu'
        ],
        response: "**Cấp độ 1 là mức biết bơi ban đầu và có kỹ năng phòng tránh đuối nước.**\n\n" +
                  "Theo tài liệu, học sinh cần:\n" +
                  "✅ Lên xuống bể an toàn.\n" +
                  "✅ Bơi được 1 hoặc 2 kiểu bơi, ít nhất 25 mét.\n" +
                  "✅ Xoay tư thế thân người khi rơi xuống nước.\n" +
                  "✅ Nổi ngửa và đứng nước ít nhất 90 giây.\n" +
                  "✅ Biết cứu đuối gián tiếp từ trên bờ."
    },

    {
        id: "safe_swimming_level_two",
        keywords: [
            'cấp độ 2 bơi',
            'cap do 2 boi',
            'bơi 50m',
            'tiêu chuẩn bơi 50 mét',
            'bơi an toàn cấp 2'
        ],
        response: "**Ở cấp độ 2, yêu cầu cao hơn cấp độ 1.**\n\n" +
                  "Theo tài liệu, học sinh cần bơi được ít nhất **50 mét**, có kỹ năng lặn chìm và di chuyển trong nước, nổi người đứng lên, nổi ngửa hoặc đứng nước ít nhất **2 phút** và biết xử lý các tình huống như nhiễm lạnh, đuối sức hoặc chuột rút.\n\n" +
                  "Đây là bước củng cố kỹ năng bơi và kỹ năng phòng tránh đuối nước."
    },

    {
        id: "safe_swimming_level_three",
        keywords: [
            'cấp độ 3 bơi',
            'cap do 3 boi',
            'bơi 100m',
            'tiêu chuẩn bơi 100 mét',
            'bơi an toàn cấp 3'
        ],
        response: "**Ở cấp độ 3, học sinh được yêu cầu có năng lực bơi và kỹ năng an toàn cao hơn.**\n\n" +
                  "Theo tài liệu, học sinh cần bơi được ít nhất **100 mét**, thực hiện nổi ngửa và đứng nước ít nhất **3 phút**, có kỹ năng thoát hiểm trong nước và kỹ năng cứu đuối gián tiếp.\n\n" +
                  "Dù đạt cấp độ cao, em vẫn phải tuân thủ các quy tắc an toàn khi xuống nước."
    },

    {
        id: "back_float_90_seconds",
        keywords: [
            'nổi ngửa 90 giây',
            'noi ngua 90 giay',
            'nổi ngửa bao lâu',
            'nổi 1 phút rưỡi',
            '90 giây dưới nước'
        ],
        response: "**Ở mức biết bơi an toàn cấp độ 1, tài liệu yêu cầu học sinh có thể nổi ngửa hoặc đứng nước ít nhất 90 giây.**\n\n" +
                  "Khoảng thời gian này giúp em có khả năng giữ đường thở trên mặt nước và chờ hỗ trợ khi gặp tình huống bất ngờ.\n\n" +
                  "Kỹ năng nổi cần được luyện tập thường xuyên dưới sự hướng dẫn của giáo viên."
    },

    {
        id: "tread_water_90_seconds",
        keywords: [
            'đứng nước 90 giây',
            'dung nuoc 90 giay',
            'đứng nước bao lâu',
            'đứng nước 1 phút rưỡi',
            '90 giây đứng nước'
        ],
        response: "**Theo tiêu chuẩn cấp độ 1 trong tài liệu, học sinh cần thực hiện đứng nước ít nhất 90 giây.**\n\n" +
                  "Đứng nước giúp em giữ đầu trên mặt nước, quan sát xung quanh và chờ người hỗ trợ.\n\n" +
                  "Đây là kỹ năng quan trọng không kém việc bơi được một quãng xa."
    },

    {
        id: "why_back_float_important",
        keywords: [
            'vì sao phải nổi ngửa',
            'tai sao noi ngua',
            'nổi ngửa quan trọng không',
            'nổi ngửa để làm gì',
            'lợi ích nổi ngửa'
        ],
        response: "**Nổi ngửa rất quan trọng vì giúp em vừa thở, vừa nghỉ và tiết kiệm sức.**\n\n" +
                  "Theo tài liệu, nổi ngửa và đứng nước là hai kỹ năng an toàn cần thiết khi học bơi.\n\n" +
                  "Khi mệt hoặc gặp khó khăn, em có thể dùng kỹ năng nổi ngửa để duy trì trạng thái an toàn trong lúc chờ người đến giúp."
    },

    {
        id: "why_treading_water_important",
        keywords: [
            'vì sao phải đứng nước',
            'tai sao dung nuoc',
            'đứng nước để làm gì',
            'đứng nước quan trọng không'
        ],
        response: "**Đứng nước giúp em giữ đầu trên mặt nước mà không cần bơi liên tục.**\n\n" +
                  "Kỹ năng này cho phép em quan sát xung quanh, kiểm soát hơi thở và chờ hỗ trợ khi cần.\n\n" +
                  "Theo tài liệu, đứng nước là một trong những kỹ năng quan trọng của bơi an toàn."
    },

    {
        id: "knowing_swim_styles_not_enough",
        keywords: [
            'biết bơi ếch là đủ chưa',
            'boi ech co an toan',
            'biết bơi sải là đủ không',
            'biết vài kiểu bơi',
            'biết bơi rồi có an toàn không'
        ],
        response: "**Chỉ biết một vài kiểu bơi chưa có nghĩa là em hoàn toàn an toàn dưới nước.**\n\n" +
                  "Tài liệu nhấn mạnh rằng em còn cần biết nổi ngửa khi mệt, nhận biết nơi nguy hiểm, không bơi một mình và có người lớn giám sát.\n\n" +
                  "Ngay cả người bơi giỏi vẫn có thể gặp chuột rút, nước xoáy hoặc thời tiết xấu."
    },

    {
        id: "safe_swimming_more_than_distance",
        keywords: [
            'bơi xa có phải bơi giỏi',
            'boi xa co an toan',
            'bơi được xa là đủ',
            'bơi nhiều mét có an toàn không',
            'bơi xa nhưng không nổi'
        ],
        response: "**Khả năng bơi xa chỉ là một phần của bơi an toàn.**\n\n" +
                  "Một người có thể bơi khá xa nhưng vẫn gặp nguy hiểm nếu không biết nổi, đứng nước, tự cứu hoặc nhận biết môi trường nước nguy hiểm.\n\n" +
                  "Vì vậy, đừng chỉ quan tâm mình bơi được bao nhiêu mét."
    },

    {
        id: "safe_swimming_requires_knowledge",
        keywords: [
            'bơi an toàn cần biết gì',
            'biet gi de boi an toan',
            'kiến thức bơi an toàn',
            'bơi giỏi cần biết gì',
            'ngoài bơi cần học gì'
        ],
        response: "**Ngoài kỹ thuật bơi, em còn cần kiến thức phòng tránh đuối nước.**\n\n" +
                  "Ví dụ: nhận biết khu vực nguy hiểm, không bơi một mình, biết xử lý khi mệt hoặc chuột rút, biết tự cứu và biết cách giúp người khác từ trên bờ.\n\n" +
                  "Đó là lý do chương trình bơi an toàn không chỉ dạy động tác bơi."
    },

    {
        id: "safe_swimming_self_rescue_required",
        keywords: [
            'bơi an toàn có cần tự cứu',
            'can ky nang tu cuu',
            'biết bơi có cần tự cứu không',
            'tự cứu trong bơi an toàn'
        ],
        response: "**Có. Kỹ năng tự cứu là một phần quan trọng của bơi an toàn.**\n\n" +
                  "Theo tài liệu, học sinh cần biết xoay tư thế cơ thể, nổi ngửa, đứng nước và bơi vào bờ khi gặp tình huống bất ngờ.\n\n" +
                  "Những kỹ năng này giúp em chủ động bảo vệ mình trước khi có người khác đến hỗ trợ."
    },

    {
        id: "safe_swimming_indirect_rescue_required",
        keywords: [
            'bơi an toàn có cần biết cứu người',
            'cuu duoi gian tiep',
            'học cứu đuối khi học bơi',
            'biết bơi cần biết cứu bạn không'
        ],
        response: "**Trong tiêu chuẩn bơi an toàn, học sinh còn cần biết kỹ năng cứu đuối gián tiếp.**\n\n" +
                  "Nghĩa là biết gọi người lớn, dùng gậy, dây, phao hoặc vật nổi từ trên bờ để hỗ trợ người gặp nạn.\n\n" +
                  "Trẻ em không nên tự nhảy xuống nước để cứu trực tiếp."
    },

    {
        id: "safe_swimming_fall_into_water_test",
        keywords: [
            'bài kiểm tra rơi xuống nước',
            'kiem tra roi xuong nuoc',
            'rơi xuống nước thi làm gì',
            'thi bơi an toàn có gì',
            'kiểm tra tự cứu'
        ],
        response: "**Trong đánh giá bơi an toàn cấp độ 1, tài liệu có tình huống thực hành khi bị rơi xuống nước.**\n\n" +
                  "Học sinh cần biết xoay tư thế thân người, nổi ngửa, đứng nước và bơi vào bờ.\n\n" +
                  "Mục đích là kiểm tra khả năng tự xử lý chứ không chỉ kiểm tra tốc độ bơi."
    },

    {
        id: "safe_swimming_level_one_enough",
        keywords: [
            'cấp 1 có đủ an toàn không',
            'cap 1 co du khong',
            'đạt cấp độ 1 rồi',
            'bơi 25m rồi có cần học thêm',
            'biết bơi ban đầu rồi'
        ],
        response: "**Cấp độ 1 là nền tảng quan trọng nhưng em vẫn nên tiếp tục rèn luyện.**\n\n" +
                  "Tài liệu xem cấp độ 1 là mức tối thiểu để đạt mục tiêu biết bơi ban đầu và phòng tránh đuối nước.\n\n" +
                  "Sau đó, học sinh được khuyến khích tiếp tục nâng cao sức bền, kỹ năng thoát hiểm và kỹ năng an toàn."
    },

    {
        id: "improve_swimming_after_25m",
        keywords: [
            'bơi 25m rồi học gì',
            'sau 25m hoc gi',
            'nâng cao bơi',
            'bơi xa hơn',
            'học bơi tiếp'
        ],
        response: "**Sau khi bơi được 25 mét, em nên tiếp tục củng cố và nâng cao kỹ năng.**\n\n" +
                  "Có thể luyện bơi xa hơn, tăng thời gian nổi ngửa và đứng nước, đồng thời học thêm kỹ năng thoát hiểm và xử lý các tình huống bất ngờ.\n\n" +
                  "Việc nâng cao cần thực hiện trong lớp bơi an toàn có người hướng dẫn."
    },

    {
        id: "safe_swimming_friend_not_supervisor",
        keywords: [
            'đi bơi với bạn giỏi',
            'ban boi gioi trong minh',
            'bạn biết bơi đi cùng',
            'không cần người lớn nếu có bạn',
            'đi bơi với bạn an toàn không'
        ],
        response: "**Đi cùng một người bạn bơi giỏi không thay thế được sự giám sát của người lớn.**\n\n" +
                  "Tài liệu nhấn mạnh trẻ em vẫn cần có người lớn có đủ khả năng giám sát và hỗ trợ khi đi bơi.\n\n" +
                  "Một người bơi giỏi chưa chắc có kỹ năng cứu hộ hoặc nhận biết được mọi nguy hiểm."
    },

    {
        id: "safe_swimming_expert_still_risk",
        keywords: [
            'người bơi giỏi có đuối không',
            'boi gioi van duoi',
            'chuyên gia bơi có gặp nạn',
            'bơi giỏi vẫn nguy hiểm'
        ],
        response: "**Có. Người bơi giỏi vẫn có thể gặp nguy hiểm.**\n\n" +
                  "Theo tài liệu, ngay cả người có kỹ năng bơi tốt vẫn có thể gặp chuột rút, vùng nước xoáy, thời tiết xấu hoặc môi trường nước lạ.\n\n" +
                  "Vì vậy, không ai nên chủ quan khi xuống nước."
    },

    {
        id: "safe_swimming_level_summary",
        keywords: [
            'tóm tắt bơi an toàn',
            'quy tac biet boi an toan',
            'biết bơi an toàn cần gì',
            'nhớ gì về bơi an toàn'
        ],
        response: "**Để được coi là biết bơi an toàn ở mức ban đầu, em hãy nhớ:**\n\n" +
                  "1. **Biết kiến thức phòng tránh đuối nước.**\n" +
                  "2. **Lên xuống bể an toàn.**\n" +
                  "3. **Bơi được ít nhất 25 mét.**\n" +
                  "4. **Nổi ngửa và đứng nước ít nhất 90 giây.**\n" +
                  "5. **Biết xử lý khi bất ngờ rơi xuống nước.**\n" +
                  "6. **Biết cứu đuối gián tiếp từ trên bờ.**\n\n" +
                  "Câu dễ nhớ: **Biết bơi + Biết nổi + Biết tự cứu + Biết phòng tránh = Bơi an toàn.**"
    },
{
        id: "swimming_benefits_general",
        keywords: [
            'học bơi có lợi gì',
            'hoc boi co loi gi',
            'bơi để làm gì',
            'tác dụng của bơi',
            'học bơi tốt không'
        ],
        response: "**Học bơi mang lại nhiều lợi ích cho học sinh.**\n\n" +
                  "Bơi giúp nâng cao sức khỏe, thể lực, phát triển cơ thể và rèn luyện khả năng vận động.\n\n" +
                  "Quan trọng hơn, học bơi an toàn còn giúp em có thêm kỹ năng tự bảo vệ khi gặp tình huống bất ngờ dưới nước.\n\n" +
                  "Tuy nhiên, biết bơi không có nghĩa là em được tự ý xuống nước ở bất cứ đâu."
    },

    {
        id: "swimming_improves_health",
        keywords: [
            'bơi có khỏe không',
            'boi co khoe khong',
            'bơi tốt cho sức khỏe',
            'học bơi có khỏe hơn không',
            'bơi giúp gì cho sức khỏe'
        ],
        response: "**Bơi là một hoạt động giúp nâng cao sức khỏe và thể lực.**\n\n" +
                  "Khi bơi, nhiều nhóm cơ trên cơ thể cùng hoạt động và em phải phối hợp tay, chân, hơi thở và tư thế cơ thể.\n\n" +
                  "Việc tập luyện phù hợp giúp cơ thể nhanh nhẹn, linh hoạt và khỏe mạnh hơn."
    },

    {
        id: "swimming_physical_development",
        keywords: [
            'bơi có phát triển cơ thể không',
            'boi phat trien the chat',
            'bơi giúp phát triển gì',
            'học bơi phát triển thể lực',
            'bơi có tốt cho thể chất'
        ],
        response: "**Theo tài liệu, học bơi góp phần phát triển thể chất và tầm vóc của học sinh.**\n\n" +
                  "Việc phối hợp tay, chân, thân người và hơi thở giúp cơ thể được vận động toàn diện.\n\n" +
                  "Bơi cũng giúp rèn luyện các tố chất như nhanh, mạnh, bền và khéo léo."
    },

    {
        id: "swimming_agility_flexibility",
        keywords: [
            'bơi có nhanh nhẹn không',
            'boi co linh hoat khong',
            'bơi giúp linh hoạt',
            'bơi giúp khéo léo',
            'bơi tăng nhanh nhẹn'
        ],
        response: "**Có. Học bơi giúp rèn luyện sự nhanh nhẹn, linh hoạt và khả năng phối hợp vận động.**\n\n" +
                  "Khi bơi, em phải phối hợp tay, chân, nhịp thở và tư thế cơ thể cùng lúc.\n\n" +
                  "Việc luyện tập đúng kỹ thuật giúp các động tác trở nên chính xác và linh hoạt hơn."
    },

    {
        id: "swimming_builds_endurance",
        keywords: [
            'bơi có tăng sức bền không',
            'boi tang suc ben',
            'bơi giúp khỏe lâu',
            'bơi rèn sức bền',
            'học bơi có dai sức'
        ],
        response: "**Bơi có thể giúp rèn luyện sức bền khi được tập đúng cách và vừa sức.**\n\n" +
                  "Tài liệu xem sức bền là một trong những tố chất thể lực được phát triển thông qua học và luyện tập bơi.\n\n" +
                  "Em không nên cố bơi quá lâu hoặc quá sức chỉ để rèn sức bền."
    },

    {
        id: "swimming_builds_strength",
        keywords: [
            'bơi có mạnh hơn không',
            'boi tang suc manh',
            'bơi có khỏe cơ không',
            'bơi rèn sức mạnh',
            'bơi có khỏe tay chân'
        ],
        response: "**Bơi giúp nhiều nhóm cơ cùng hoạt động nên góp phần phát triển sức mạnh của cơ thể.**\n\n" +
                  "Tay, chân và thân người đều phải phối hợp để cơ thể di chuyển trong nước.\n\n" +
                  "Việc luyện tập cần phù hợp với tuổi và thể trạng, không nên cố gắng quá sức."
    },

    {
        id: "swimming_body_coordination",
        keywords: [
            'bơi có giúp phối hợp không',
            'phoi hop tay chan',
            'bơi phối hợp cơ thể',
            'tay chân khi bơi',
            'bơi giúp phối hợp vận động'
        ],
        response: "**Một lợi ích quan trọng của học bơi là rèn khả năng phối hợp vận động.**\n\n" +
                  "Em phải phối hợp chân, tay, tư thế thân người và cách thở để thực hiện đúng kỹ thuật.\n\n" +
                  "Khả năng phối hợp tốt cũng hỗ trợ em xử lý các tình huống dưới nước hiệu quả hơn."
    },

    {
        id: "swimming_builds_confidence",
        keywords: [
            'bơi có tự tin hơn không',
            'boi giup tu tin',
            'học bơi bớt sợ nước',
            'sợ nước học bơi',
            'bơi giúp mạnh dạn'
        ],
        response: "**Học bơi đúng cách có thể giúp em mạnh dạn và tự tin hơn trong môi trường nước.**\n\n" +
                  "Khi được làm quen với nước, học cách nổi, đứng nước và bơi từng bước, em sẽ hiểu rõ hơn cách cơ thể hoạt động dưới nước.\n\n" +
                  "Tự tin ở đây không có nghĩa là chủ quan. Em vẫn phải tuân thủ các quy tắc an toàn."
    },

    {
        id: "swimming_reduces_fear_of_water",
        keywords: [
            'sợ nước phải làm sao',
            'so nuoc hoc boi',
            'học bơi có hết sợ nước',
            'sợ xuống hồ',
            'không dám xuống nước'
        ],
        response: "**Học bơi theo từng bước có thể giúp em dần làm quen và bớt sợ nước.**\n\n" +
                  "Giáo viên thường cho học sinh làm quen với nước, tập thở, tập nổi và tập các kỹ năng đơn giản trước khi học bơi hoàn chỉnh.\n\n" +
                  "Không nên tự ép mình xuống nơi sâu hoặc tự tập một mình."
    },

    {
        id: "swimming_self_protection",
        keywords: [
            'học bơi để tự bảo vệ',
            'boi de tu bao ve',
            'bơi giúp tự cứu không',
            'học bơi phòng đuối nước',
            'bơi giúp an toàn'
        ],
        response: "**Học bơi an toàn giúp em chủ động bảo vệ bản thân tốt hơn trong môi trường nước.**\n\n" +
                  "Nếu được học đầy đủ, em có thể biết cách nổi, đứng nước, tự cứu và xử lý một số tình huống bất ngờ.\n\n" +
                  "Tuy nhiên, khả năng tự bảo vệ chỉ tốt khi đi kèm kiến thức phòng tránh nguy hiểm."
    },

    {
        id: "swimming_escape_unexpected_fall",
        keywords: [
            'học bơi giúp khi rơi xuống nước',
            'roi xuong nuoc biet boi',
            'bơi giúp thoát hiểm',
            'biết bơi khi ngã xuống nước',
            'học bơi để thoát nạn'
        ],
        response: "**Học bơi và kỹ năng an toàn có thể giúp em xử lý tốt hơn nếu bất ngờ rơi xuống nước.**\n\n" +
                  "Em có thể sử dụng những kỹ năng đã học như giữ bình tĩnh, nổi ngửa, đứng nước và từ từ tìm cách đến nơi an toàn.\n\n" +
                  "Đó là lý do tài liệu coi học bơi là một biện pháp quan trọng để phòng tránh đuối nước."
    },

    {
        id: "swimming_handles_water_emergencies",
        keywords: [
            'bơi giúp xử lý sự cố gì',
            'su co khi boi',
            'học bơi xử lý nguy hiểm',
            'bơi gặp chuột rút',
            'bơi gặp nước xoáy'
        ],
        response: "**Một khóa học bơi an toàn không chỉ dạy cách di chuyển trong nước mà còn giúp em chuẩn bị cho các tình huống nguy hiểm.**\n\n" +
                  "Tài liệu đề cập các tình huống như bất ngờ rơi xuống nước, chuột rút, nước xoáy, nước cuốn hoặc mưa lũ.\n\n" +
                  "Các kỹ năng này cần được học và thực hành với người hướng dẫn."
    },

    {
        id: "swimming_survival_skill",
        keywords: [
            'bơi có phải kỹ năng sống',
            'boi la ky nang song',
            'bơi sinh tồn',
            'kỹ năng sinh tồn dưới nước',
            'học bơi để sinh tồn'
        ],
        response: "**Học bơi an toàn là một kỹ năng sống quan trọng.**\n\n" +
                  "Ngoài kỹ thuật bơi, em còn học cách nổi, đứng nước, tự cứu và nhận biết nguy cơ đuối nước.\n\n" +
                  "Những kỹ năng này có thể giúp em bảo vệ mình khi gặp sự cố bất ngờ trong môi trường nước."
    },

    {
        id: "swimming_teaches_discipline",
        keywords: [
            'học bơi có rèn kỷ luật không',
            'boi ren ky luat',
            'bơi có rèn tính kiên trì',
            'học bơi rèn gì',
            'bơi giúp cố gắng'
        ],
        response: "**Theo tài liệu, quá trình học bơi còn góp phần rèn tính kiên trì, nỗ lực và kỷ luật.**\n\n" +
                  "Em cần tập từng động tác, làm theo hướng dẫn và kiên trì luyện tập mới tiến bộ.\n\n" +
                  "Đồng thời, việc tuân thủ nội quy cũng giúp hình thành thói quen bảo vệ an toàn cho bản thân."
    },

    {
        id: "swimming_enjoyment_exercise",
        keywords: [
            'bơi có vui không',
            'hoc boi co vui',
            'bơi có phải vận động tốt',
            'bơi để vui chơi',
            'thích học bơi'
        ],
        response: "**Bơi vừa là một kỹ năng an toàn vừa là một hoạt động vận động thú vị.**\n\n" +
                  "Tài liệu hướng tới việc giúp học sinh hình thành hứng thú, yêu thích vận động và rèn luyện kỹ năng sống.\n\n" +
                  "Nhưng vui chơi dưới nước luôn phải đặt an toàn lên trước."
    },

    {
        id: "swimming_health_and_safety",
        keywords: [
            'học bơi vừa khỏe vừa an toàn',
            'boi khoe va an toan',
            'bơi tốt cho gì nhất',
            'lợi ích chính của bơi'
        ],
        response: "**Có thể nhớ hai lợi ích lớn của học bơi là: nâng cao thể chất và tăng khả năng tự bảo vệ trong môi trường nước.**\n\n" +
                  "Bơi giúp em khỏe hơn, linh hoạt hơn và học thêm các kỹ năng tự cứu.\n\n" +
                  "Hai mục tiêu này luôn phải đi cùng nhau."
    },

    {
        id: "swimming_does_not_remove_risk",
        keywords: [
            'biết bơi là hết nguy hiểm chưa',
            'biet boi het nguy hiem',
            'biết bơi có đuối không',
            'học bơi rồi có an toàn tuyệt đối',
            'bơi giỏi có sợ đuối không'
        ],
        response: "**Không. Học bơi không làm mọi nguy hiểm dưới nước biến mất.**\n\n" +
                  "Người biết bơi vẫn có thể gặp chuột rút, mệt, nước xoáy, dòng chảy mạnh hoặc thời tiết xấu.\n\n" +
                  "Vì vậy, em vẫn cần bơi đúng nơi, có người lớn giám sát và tuân thủ các quy tắc an toàn."
    },

    {
        id: "learned_swimming_can_go_alone",
        keywords: [
            'biết bơi đi một mình được không',
            'biet boi di mot minh',
            'học bơi rồi tự đi bơi',
            'biết bơi không cần người lớn',
            'bơi giỏi đi hồ một mình'
        ],
        response: "**Không. Trẻ em dù đã biết bơi vẫn không nên đi bơi một mình.**\n\n" +
                  "Tài liệu nhấn mạnh trẻ em cần có người lớn giám sát khi bơi.\n\n" +
                  "Một tình huống bất ngờ như chuột rút, mệt hoặc nước xoáy vẫn có thể xảy ra với người bơi tốt."
    },

    {
        id: "learned_swimming_any_water",
        keywords: [
            'biết bơi xuống đâu cũng được không',
            'biet boi o dau cung duoc',
            'học bơi rồi xuống sông',
            'biết bơi tắm ao được không',
            'bơi giỏi xuống chỗ lạ'
        ],
        response: "**Biết bơi không có nghĩa là em có thể xuống mọi nơi có nước.**\n\n" +
                  "Sông, hồ, ao và biển có thể có độ sâu thay đổi, dòng chảy mạnh, nước xoáy hoặc vật cản dưới nước.\n\n" +
                  "Chỉ bơi ở nơi được phép, phù hợp và có người lớn giám sát."
    },

    {
        id: "swimming_not_permission_to_take_risks",
        keywords: [
            'biết bơi có được liều không',
            'boi gioi duoc mao hiem',
            'bơi giỏi thử chỗ sâu',
            'học bơi rồi thử nước xoáy',
            'bơi giỏi có được thử sức'
        ],
        response: "**Không nên dùng khả năng bơi để thử những tình huống nguy hiểm.**\n\n" +
                  "Biết bơi là để giúp em an toàn hơn, không phải để bơi vào nước sâu, nước xoáy, dòng chảy mạnh hoặc nơi bị cấm.\n\n" +
                  "Kỹ năng tốt luôn phải đi cùng sự cẩn thận."
    },

    {
        id: "swimming_help_rescue_others_limit",
        keywords: [
            'học bơi có cứu được người không',
            'biet boi cuu nguoi',
            'bơi để cứu bạn',
            'học bơi rồi cứu đuối',
            'bơi giỏi cứu người'
        ],
        response: "**Học bơi giúp em hiểu môi trường nước tốt hơn, nhưng không có nghĩa là trẻ em được tự xuống nước cứu người.**\n\n" +
                  "Với học sinh, ưu tiên vẫn là cứu đuối gián tiếp: gọi người lớn, đưa gậy, ném phao hoặc vật nổi.\n\n" +
                  "Cứu đuối trực tiếp là kỹ năng khó và nguy hiểm, cần được đào tạo chuyên nghiệp."
    },

    {
        id: "swimming_benefits_summary",
        keywords: [
            'tóm tắt lợi ích học bơi',
            'loi ich boi de nho',
            'học bơi tốt gì',
            'nhớ gì về học bơi'
        ],
        response: "**Học bơi giúp em:**\n\n" +
                  "✅ Nâng cao sức khỏe và thể lực.\n" +
                  "✅ Rèn sự nhanh nhẹn, linh hoạt, sức bền và phối hợp vận động.\n" +
                  "✅ Tự tin hơn trong môi trường nước.\n" +
                  "✅ Học kỹ năng tự cứu và phòng tránh đuối nước.\n" +
                  "✅ Rèn sự kiên trì, kỷ luật và kỹ năng sống.\n\n" +
                  "Nhưng hãy nhớ: **Biết bơi không đồng nghĩa với được tự ý xuống nước.**"
    },
{
        id: "playing_near_water_general",
        keywords: [
            'chơi gần sông hồ',
            'choi gan song ho',
            'chơi gần ao',
            'chơi gần nước',
            'vui chơi ven sông'
        ],
        response: "**Chơi gần ao, hồ, sông, suối có thể nguy hiểm nếu em đến quá sát mép nước.**\n\n" +
                  "Bờ có thể trơn, bị sạt hoặc có chỗ sâu bất ngờ khiến em trượt chân rơi xuống nước.\n\n" +
                  "Khi vui chơi, hãy chọn nơi cách xa vùng nước nguy hiểm và luôn nghe lời người lớn."
    },

    {
        id: "after_school_near_water",
        keywords: [
            'tan học ra sông chơi',
            'tan hoc ra ho',
            'đi chơi sau giờ học',
            'tan trường đi tắm',
            'sau học ra ao'
        ],
        response: "**Sau giờ học, em không nên rủ bạn ra ao, hồ, sông, suối để chơi hoặc tắm.**\n\n" +
                  "Tài liệu cảnh báo nhiều vụ đuối nước xảy ra sau khi tan trường do học sinh rủ nhau đến các vùng nước mở.\n\n" +
                  "Hãy về nhà hoặc tham gia hoạt động ở nơi an toàn."
    },

    {
        id: "holiday_near_water",
        keywords: [
            'nghỉ hè ra sông',
            'nghi he di tam',
            'nghỉ học ra hồ',
            'nghỉ lễ đi tắm',
            'nghỉ hè chơi gần nước'
        ],
        response: "**Trong ngày nghỉ hoặc nghỉ hè, em càng cần nhớ các quy tắc phòng tránh đuối nước.**\n\n" +
                  "Không tự rủ nhau đi tắm, bơi hoặc chơi ở ao, hồ, sông, suối khi không có người lớn đi cùng.\n\n" +
                  "Khi vui chơi, rất dễ quên nguy hiểm nên hãy chọn địa điểm an toàn."
    },

    {
        id: "friends_invite_water_play",
        keywords: [
            'bạn rủ ra sông chơi',
            'ban ru ra ho',
            'rủ đi tắm sông',
            'bạn rủ đi bơi',
            'rủ nhau ra đập'
        ],
        response: "**Nếu bạn rủ em ra sông, hồ hoặc đập để tắm hay chơi mà không có người lớn, em nên từ chối.**\n\n" +
                  "Em có thể nói: **“Không nên đi một mình, chỗ đó nguy hiểm.”**\n\n" +
                  "Nếu muốn đi bơi, hãy xin phép gia đình và chọn nơi an toàn có người lớn giám sát."
    },

    {
        id: "catching_fish_near_water",
        keywords: [
            'bắt cá gần ao',
            'bat ca o song',
            'đi bắt cá',
            'bắt cá dưới mương',
            'xuống ao bắt cá'
        ],
        response: "**Bắt cá ở ao, hồ, sông hoặc mương có thể làm em đến rất gần vùng nước sâu và trơn trượt.**\n\n" +
                  "Tài liệu nêu rằng học sinh tiểu học có thể gặp đuối nước khi chơi đùa hoặc bắt cá ở ao hồ, sông suối gần nhà.\n\n" +
                  "Em không nên tự xuống nước hoặc ra mép ao, sông để bắt cá khi không có người lớn bảo đảm an toàn."
    },

    {
        id: "fish_in_water_curiosity",
        keywords: [
            'xem cá gần nước',
            'xem ca trong chum',
            'cúi xem cá',
            'nhìn cá trong ao',
            'xem cá có nguy hiểm không'
        ],
        response: "**Khi xem cá, em vẫn cần giữ khoảng cách an toàn với mép nước hoặc vật chứa nước.**\n\n" +
                  "Không cúi người quá sâu, trèo lên thành chum, bể hoặc đứng sát mép ao.\n\n" +
                  "Một cú trượt chân cũng có thể làm em rơi xuống nước."
    },

    {
        id: "ball_falls_into_water",
        keywords: [
            'bóng rơi xuống sông',
            'bong roi xuong nuoc',
            'bóng rơi xuống hồ',
            'bóng xuống ao',
            'lấy bóng dưới nước'
        ],
        response: "**Nếu bóng rơi xuống sông, hồ hoặc ao, em không được tự bơi hoặc lội xuống lấy.**\n\n" +
                  "Tài liệu nêu tình huống thực tế học sinh chơi bóng gần sông, bóng rơi xuống nước và có em bơi ra lấy rồi gặp vùng nước xoáy.\n\n" +
                  "Hãy để bóng lại và gọi người lớn hỗ trợ. **Mất một quả bóng còn hơn gặp nguy hiểm đến tính mạng.**"
    },

    {
        id: "toy_falls_into_water",
        keywords: [
            'đồ chơi rơi xuống nước',
            'do choi roi xuong ao',
            'đồ rơi xuống sông',
            'lấy đồ dưới hồ',
            'đồ vật rơi xuống nước'
        ],
        response: "**Nếu đồ chơi hoặc đồ vật rơi xuống vùng nước nguy hiểm, em không nên tự xuống lấy.**\n\n" +
                  "Nước có thể sâu hơn em nghĩ hoặc có dòng chảy, bùn, vật cản bên dưới.\n\n" +
                  "Hãy gọi người lớn. Đồ vật có thể thay thế được, còn sự an toàn của em là quan trọng nhất."
    },

    {
        id: "football_near_river",
        keywords: [
            'đá bóng gần sông',
            'da bong gan song',
            'chơi bóng ven hồ',
            'đá bóng gần nước',
            'bóng đá ven sông'
        ],
        response: "**Không nên chọn bãi chơi bóng quá gần sông, hồ hoặc vùng nước sâu.**\n\n" +
                  "Bóng có thể lăn xuống nước và khiến em hoặc bạn muốn xuống lấy.\n\n" +
                  "Tài liệu đã nêu một vụ việc nghiêm trọng xảy ra từ tình huống bóng bị đá xuống sông.\n\n" +
                  "Hãy chọn sân chơi cách xa mép nước."
    },

    {
        id: "play_near_dam",
        keywords: [
            'chơi gần đập',
            'choi gan dap',
            'ra đập chơi',
            'đi chơi hồ đập',
            'đập nước có nguy hiểm không'
        ],
        response: "**Hồ và đập nước là nơi không phù hợp để trẻ em tự ý vui chơi.**\n\n" +
                  "Nước có thể sâu, bờ trơn và có những vùng nguy hiểm khó nhìn thấy.\n\n" +
                  "Tài liệu cảnh báo học sinh không được tự rủ nhau chơi đùa trên hồ, đập hoặc sông."
    },

    {
        id: "slippery_water_edge",
        keywords: [
            'bờ sông trơn',
            'bo ao tron',
            'trượt chân xuống nước',
            'mép hồ trơn',
            'đứng sát mép nước'
        ],
        response: "**Bờ ao, hồ hoặc sông có thể trơn và làm em trượt chân bất ngờ.**\n\n" +
                  "Không đứng sát mép, chạy nhảy hoặc xô đẩy nhau ở khu vực này.\n\n" +
                  "Nếu cần quan sát mặt nước, hãy đứng ở nơi chắc chắn và có khoảng cách an toàn."
    },

    {
        id: "push_friend_near_water",
        keywords: [
            'xô bạn gần nước',
            'day ban xuong nuoc',
            'đùa đẩy nhau ven sông',
            'đẩy bạn xuống hồ',
            'xô nhau gần ao'
        ],
        response: "**Không được xô, đẩy hoặc giả vờ đẩy bạn xuống nước.**\n\n" +
                  "Một trò đùa có thể khiến bạn mất thăng bằng, rơi xuống chỗ sâu hoặc đập vào vật cứng.\n\n" +
                  "Khi vui chơi gần nước, cần giữ khoảng cách và không đùa nghịch nguy hiểm."
    },

    {
        id: "holding_hands_rescue_chain",
        keywords: [
            'nắm tay nhau cứu bạn',
            'nam tay cuu ban',
            'xếp hàng kéo bạn',
            'nối tay cứu người',
            'cả nhóm kéo bạn'
        ],
        response: "**Không nên nắm tay nhau thành chuỗi để kéo người đang ở dưới nước nếu việc đó khiến các em tiến sát hoặc xuống nước.**\n\n" +
                  "Tài liệu nêu những vụ việc nhiều học sinh cùng gặp nạn khi lần lượt nắm tay nhau để cứu bạn.\n\n" +
                  "Hãy gọi người lớn và dùng gậy, dây hoặc phao từ vị trí an toàn."
    },

    {
        id: "one_friend_falls_group_action",
        keywords: [
            'một bạn rơi xuống nước',
            'mot ban roi xuong nuoc',
            'bạn trượt chân xuống hồ',
            'bạn ngã xuống ao',
            'bạn rơi xuống sông'
        ],
        response: "**Nếu một bạn trong nhóm rơi xuống nước, những bạn còn lại không được lần lượt nhảy xuống cứu.**\n\n" +
                  "Hãy hô cứu thật to, gọi người lớn và tìm vật nổi hoặc vật dài để hỗ trợ từ trên bờ.\n\n" +
                  "Điều quan trọng là không để một tai nạn trở thành tai nạn của cả nhóm."
    },

    {
        id: "group_water_play_risk",
        keywords: [
            'đi chơi đông có an toàn không',
            'di choi ca nhom gan song',
            'đông bạn ra hồ',
            'cả nhóm đi tắm',
            'nhiều bạn đi cùng'
        ],
        response: "**Có nhiều bạn đi cùng không có nghĩa là khu vực nước trở nên an toàn.**\n\n" +
                  "Nếu không có người lớn và không ai có kỹ năng cứu hộ, khi một bạn gặp nạn những bạn khác rất dễ hoảng loạn và cứu sai cách.\n\n" +
                  "Trẻ em vẫn cần có người lớn giám sát."
    },

    {
        id: "picnic_near_water_safety",
        keywords: [
            'dã ngoại gần hồ',
            'da ngoai gan song',
            'picnic gần nước',
            'đi chơi ven hồ',
            'đi chơi gần sông'
        ],
        response: "**Khi đi chơi hoặc dã ngoại ở nơi gần sông, hồ, em cần áp dụng các nguyên tắc an toàn giống như khi vui chơi gần vùng nước mở.**\n\n" +
                  "Không tự tách khỏi người lớn để ra sát mép nước, không tự xuống tắm và không chạy nhảy ở bờ trơn.\n\n" +
                  "Nếu muốn xuống nước, chỉ thực hiện tại khu vực được phép và có người lớn giám sát."
    },

    {
        id: "trip_to_beach_with_family",
        keywords: [
            'đi du lịch biển',
            'di bien voi gia dinh',
            'đi chơi biển',
            'du lịch tắm biển',
            'đi biển cần nhớ gì'
        ],
        response: "**Khi đi du lịch biển, em chỉ nên tắm ở khu vực an toàn và có người lớn đi cùng.**\n\n" +
                  "Tài liệu có tình huống riêng hướng dẫn học sinh nhận biết khu vực được tắm và khu vực không an toàn.\n\n" +
                  "Không tự ý chạy ra biển hoặc xuống nước khi người lớn chưa đồng ý."
    },

    {
        id: "leave_group_near_water",
        keywords: [
            'tách nhóm ra bờ sông',
            'tu di ra ho',
            'đi riêng gần nước',
            'trốn người lớn ra sông',
            'một mình ra bờ hồ'
        ],
        response: "**Không nên tự tách khỏi nhóm hoặc người lớn để đi ra khu vực gần nước.**\n\n" +
                  "Nếu xảy ra trượt ngã hoặc sự cố, có thể không ai phát hiện kịp thời.\n\n" +
                  "Hãy luôn ở trong phạm vi mà người lớn có thể quan sát và hỗ trợ."
    },

    {
        id: "take_photo_near_water_edge",
        keywords: [
            'chụp ảnh sát mép nước',
            'chup anh bo song',
            'chụp hình ven hồ',
            'đứng sát nước chụp ảnh',
            'selfie gần sông'
        ],
        response: "**Khi chụp ảnh gần sông, hồ hoặc ao, em vẫn phải giữ khoảng cách an toàn.**\n\n" +
                  "Không lùi sát mép nước, trèo lên đá trơn hoặc đứng ở vị trí dễ trượt ngã chỉ để chụp hình.\n\n" +
                  "Nếu khu vực không chắc chắn, hãy chọn vị trí khác an toàn hơn."
    },

    {
        id: "water_play_without_adult",
        keywords: [
            'chơi nước không có người lớn',
            'choi nuoc mot minh',
            'không có người lớn vẫn chơi',
            'bạn bè tự đi chơi nước',
            'tự đi ra hồ'
        ],
        response: "**Trẻ em không nên tự chơi ở vùng nước mở khi không có người lớn giám sát.**\n\n" +
                  "Ao, hồ, sông, suối có thể có chỗ sâu, bùn, dòng chảy hoặc vật cản mà em không nhận biết được.\n\n" +
                  "Hãy chọn nơi vui chơi khác an toàn hơn."
    },

    {
        id: "water_activity_safe_choice",
        keywords: [
            'muốn chơi gần nước làm sao',
            'choi gan nuoc an toan',
            'đi chơi hồ sao an toàn',
            'vui chơi ven sông',
            'chọn chỗ chơi an toàn'
        ],
        response: "**Nếu hoạt động ở nơi gần nước, hãy chọn khu vực bằng phẳng, chắc chắn và cách xa mép nước nguy hiểm.**\n\n" +
                  "Luôn ở gần người lớn, không tự ý xuống nước và không đuổi bắt, xô đẩy nhau sát bờ.\n\n" +
                  "Nếu thấy biển cấm hoặc khu vực nguy hiểm, hãy tránh xa."
    },

    {
        id: "daily_water_safety_summary",
        keywords: [
            'nhớ gì khi chơi gần nước',
            'quy tac choi gan nuoc',
            'tóm tắt vui chơi an toàn',
            'chơi gần sông nhớ gì',
            'đi chơi gần hồ cần nhớ'
        ],
        response: "**Khi vui chơi gần ao, hồ, sông hoặc suối, em hãy nhớ:**\n\n" +
                  "1. **Không đến sát mép nước.**\n" +
                  "2. **Không tự xuống lấy bóng hoặc đồ vật.**\n" +
                  "3. **Không bắt cá, tắm hoặc bơi khi không có người lớn.**\n" +
                  "4. **Không xô đẩy, chạy nhảy sát bờ.**\n" +
                  "5. Nếu bạn rơi xuống nước, **gọi người lớn – dùng gậy/dây/phao – không nhảy xuống cứu.**\n\n" +
                  "Câu dễ nhớ: **Chơi xa mép nước – Đồ rơi không xuống lấy – Bạn gặp nạn thì gọi người lớn.**"
    },
 {
        id: "known_swimmer_can_swim_anywhere",
        keywords: [
            'biết bơi rồi xuống sông được không',
            'biet boi xuong song',
            'bơi giỏi xuống hồ được không',
            'biết bơi tắm ao được không',
            'biết bơi xuống đâu cũng được'
        ],
        response: "**Không. Biết bơi không có nghĩa là em có thể xuống bất kỳ nơi nào có nước.**\n\n" +
                  "Sông, hồ, ao hoặc biển có thể có chỗ sâu bất ngờ, dòng chảy mạnh, nước xoáy hoặc vật cản dưới nước.\n\n" +
                  "Em chỉ nên bơi ở khu vực an toàn, được phép và có người lớn giám sát."
    },

    {
        id: "shallow_water_is_always_safe",
        keywords: [
            'nước nông có nguy hiểm không',
            'nuoc nong co sao khong',
            'nước cạn có đuối không',
            'chỗ nông có an toàn',
            'nông thì không sao đúng không'
        ],
        response: "**Không nên nghĩ nước nông là hoàn toàn an toàn.**\n\n" +
                  "Độ sâu có thể thay đổi đột ngột và dưới nước có thể có hố, bùn, vật sắc nhọn hoặc chỗ trơn.\n\n" +
                  "Trẻ em vẫn cần có người lớn giám sát khi ở gần hoặc trong nước."
    },

    {
        id: "calm_water_is_always_safe",
        keywords: [
            'nước yên có an toàn không',
            'nuoc yen co an toan',
            'nước lặng có sao không',
            'không có sóng là an toàn',
            'nước phẳng có bơi được'
        ],
        response: "**Không. Nước yên chưa chắc là nước an toàn.**\n\n" +
                  "Theo tài liệu, vùng nước yên vẫn có thể có dòng chảy mạnh, vật sắc nhọn, chất bẩn hoặc độ sâu thay đổi bất ngờ.\n\n" +
                  "Ở biển, vùng lặng sóng thậm chí có thể liên quan đến dòng chảy xa bờ."
    },

    {
        id: "life_jacket_allows_anywhere",
        keywords: [
            'có áo phao xuống đâu cũng được không',
            'ao phao la an toan',
            'mặc phao rồi xuống sông',
            'có phao thì bơi đâu cũng được',
            'áo phao là đủ chưa'
        ],
        response: "**Không. Áo phao giúp tăng an toàn nhưng không biến mọi vùng nước thành nơi an toàn.**\n\n" +
                  "Em vẫn phải tránh nơi nước sâu, nước xoáy, dòng chảy mạnh hoặc khu vực bị cấm.\n\n" +
                  "Áo phao phải được mặc đúng cách, đúng kích cỡ và trẻ em vẫn cần người lớn giám sát."
    },

    {
        id: "life_jacket_wrong_size_safe",
        keywords: [
            'áo phao rộng có sao không',
            'ao phao sai co',
            'phao to quá có dùng được',
            'áo phao nhỏ có được không',
            'phao không vừa'
        ],
        response: "**Áo phao cần đúng kích cỡ với người mặc.**\n\n" +
                  "Áo phao quá rộng hoặc không được mặc đúng cách có thể không giữ cơ thể ổn định khi xuống nước.\n\n" +
                  "Hãy nhờ người lớn kiểm tra và cài áo phao đúng trước khi sử dụng."
    },

    {
        id: "swim_with_good_friend_no_adult",
        keywords: [
            'đi với bạn bơi giỏi được không',
            'ban boi gioi trong minh',
            'không có người lớn nhưng có bạn',
            'đi bơi với anh biết bơi',
            'bạn giỏi bơi là đủ chưa'
        ],
        response: "**Không. Một người bạn bơi giỏi không thể thay thế người lớn giám sát.**\n\n" +
                  "Theo tài liệu, bơi giỏi không có nghĩa là người đó biết nhận biết mọi nguy hiểm hoặc có kỹ năng cứu hộ.\n\n" +
                  "Trẻ em vẫn cần người lớn đủ khả năng quan sát và hỗ trợ."
    },

    {
        id: "swim_alone_if_good_swimmer",
        keywords: [
            'bơi giỏi đi một mình được không',
            'boi mot minh duoc khong',
            'biết bơi có đi một mình được',
            'một mình xuống hồ',
            'tự đi bơi được không'
        ],
        response: "**Không. Trẻ em không nên bơi một mình dù đã biết bơi.**\n\n" +
                  "Sự cố như chuột rút, mệt, dòng nước mạnh hoặc nước xoáy có thể xảy ra bất ngờ.\n\n" +
                  "Luôn cần có người lớn giám sát khi em bơi."
    },

    {
        id: "swim_without_lifeguard",
        keywords: [
            'không có cứu hộ có bơi không',
            'khong co cuu ho',
            'bãi biển không cứu hộ',
            'hồ không có nhân viên cứu hộ',
            'không cứu hộ vẫn tắm'
        ],
        response: "**Nơi an toàn hơn để bơi là nơi có người lớn giám sát và có lực lượng cứu hộ khi cần.**\n\n" +
                  "Nếu khu vực không có nhân viên cứu hộ, em càng không được tự ý xuống nước.\n\n" +
                  "Hãy hỏi người lớn và chỉ bơi ở nơi được xác định là an toàn."
    },

    {
        id: "good_weather_means_water_safe",
        keywords: [
            'trời đẹp thì nước an toàn đúng không',
            'troi dep co an toan',
            'không mưa thì bơi đâu cũng được',
            'thời tiết tốt là đủ chưa'
        ],
        response: "**Thời tiết tốt chỉ là một điều kiện, chưa đủ để khẳng định nơi đó an toàn.**\n\n" +
                  "Em vẫn cần xem độ sâu, dòng chảy, biển báo, khu vực được phép và phải có người lớn giám sát."
    },

    {
        id: "pool_is_always_safe",
        keywords: [
            'hồ bơi luôn an toàn đúng không',
            'be boi co nguy hiem',
            'bể bơi có đuối không',
            'hồ bơi thì không sao',
            'bể bơi an toàn tuyệt đối'
        ],
        response: "**Không. Bể bơi an toàn hơn khi được quản lý tốt nhưng vẫn có thể xảy ra tai nạn.**\n\n" +
                  "Em vẫn cần tuân thủ nội quy, bơi đúng khu vực, không xô đẩy, không tự nhảy xuống chỗ sâu và nghe hướng dẫn của giáo viên hoặc cứu hộ."
    },

    {
        id: "river_near_home_is_safe",
        keywords: [
            'sông gần nhà có an toàn không',
            'song gan nha',
            'ao nhà quen rồi có sao không',
            'hồ gần nhà quen thuộc',
            'chỗ quen có nguy hiểm không'
        ],
        response: "**Nơi quen thuộc vẫn có thể nguy hiểm.**\n\n" +
                  "Mực nước, dòng chảy hoặc đáy sông hồ có thể thay đổi mà em không biết.\n\n" +
                  "Không nên chủ quan chỉ vì em đã từng chơi hoặc bơi ở đó nhiều lần."
    },

    {
        id: "know_one_stroke_is_safe",
        keywords: [
            'biết bơi ếch là an toàn chưa',
            'biet boi ech la du',
            'biết một kiểu bơi',
            'bơi sải là đủ chưa',
            'biết bơi cơ bản là đủ'
        ],
        response: "**Chưa. Chỉ biết một kiểu bơi không có nghĩa là em đã an toàn hoàn toàn.**\n\n" +
                  "Em còn cần biết nổi ngửa, đứng nước, tự cứu, nhận biết nơi nguy hiểm và tuân thủ quy tắc an toàn.\n\n" +
                  "Tài liệu nhấn mạnh rằng ngay cả người bơi giỏi vẫn có thể gặp sự cố."
    },

    {
        id: "strong_swimmer_can_rescue_directly",
        keywords: [
            'bơi giỏi cứu người được không',
            'boi gioi nhay cuu',
            'biết bơi có nhảy xuống cứu',
            'em bơi giỏi em cứu bạn nhé',
            'giỏi bơi cứu trực tiếp'
        ],
        response: "**Không nên. Trẻ em dù bơi giỏi vẫn không nên nhảy xuống cứu trực tiếp.**\n\n" +
                  "Người bị đuối nước có thể hoảng loạn, bấu víu và kéo người cứu xuống theo.\n\n" +
                  "Hãy gọi người lớn, đưa gậy hoặc ném phao từ nơi an toàn."
    },

    {
        id: "small_amount_water_cannot_drown",
        keywords: [
            'ít nước có đuối không',
            'it nuoc co sao khong',
            'chậu ít nước có nguy hiểm',
            'xô ít nước có đuối',
            'nước ít không sao đúng không'
        ],
        response: "**Sai. Một lượng nước nhỏ vẫn có thể gây đuối nước, đặc biệt với trẻ nhỏ.**\n\n" +
                  "Vì vậy, xô, chậu, lu, chum, bể hoặc các vật chứa nước cần được che đậy, cất an toàn hoặc làm rỗng khi không dùng."
    },

    {
        id: "warning_sign_absent_means_safe",
        keywords: [
            'không có biển cấm là an toàn',
            'khong co bien bao',
            'không có biển nguy hiểm',
            'không cấm thì xuống được',
            'không thấy cảnh báo'
        ],
        response: "**Không. Không có biển cảnh báo không có nghĩa là khu vực đó an toàn.**\n\n" +
                  "Tài liệu nhấn mạnh rằng môi trường sống có nhiều nguy cơ đuối nước nhưng không phải nơi nào cũng có biển cảnh báo.\n\n" +
                  "Nếu không rõ độ sâu hoặc mức độ an toàn, em không nên xuống nước."
    },

    {
        id: "adult_present_means_any_water_safe",
        keywords: [
            'có người lớn thì xuống đâu cũng được',
            'co nguoi lon la an toan',
            'người lớn đi cùng thì bơi nước xiết',
            'có bố mẹ thì chỗ sâu cũng được',
            'có người lớn khỏi sợ'
        ],
        response: "**Không. Có người lớn đi cùng không có nghĩa là em được xuống mọi vùng nước.**\n\n" +
                  "Tài liệu vẫn yêu cầu trẻ em tránh những nơi nước sâu, chảy xiết hoặc nước xoáy, kể cả khi có người lớn giám sát.\n\n" +
                  "Người lớn giúp giám sát, nhưng việc chọn nơi an toàn vẫn rất quan trọng."
    },

    {
        id: "float_device_replaces_supervision",
        keywords: [
            'có phao không cần người lớn',
            'co phao khoi can giam sat',
            'mặc phao tự bơi',
            'áo phao thay người lớn được không',
            'có phao thì đi một mình'
        ],
        response: "**Không. Áo phao không thay thế được sự giám sát của người lớn.**\n\n" +
                  "Phao chỉ là một phương tiện hỗ trợ an toàn.\n\n" +
                  "Trẻ em vẫn cần người lớn ở gần để quan sát và hỗ trợ nếu có sự cố."
    },

    {
        id: "quiet_beach_without_waves_safe",
        keywords: [
            'biển không có sóng có an toàn',
            'bien lang an toan',
            'chỗ ít sóng có bơi được',
            'biển yên xuống được không',
            'không sóng thì an toàn'
        ],
        response: "**Không nên kết luận như vậy.**\n\n" +
                  "Theo tài liệu, một số vùng biển ít sóng có thể là khu vực có dòng chảy rút xa bờ.\n\n" +
                  "Hãy tắm ở khu vực được phép và hỏi nhân viên cứu hộ hoặc người lớn nếu không chắc."
    },

    {
        id: "swim_when_tired_if_good_swimmer",
        keywords: [
            'mệt nhưng biết bơi có xuống được không',
            'met van boi',
            'bơi giỏi nhưng mệt',
            'mệt có đi bơi được',
            'đang mệt xuống nước'
        ],
        response: "**Không. Khi cơ thể mệt, em không nên xuống nước dù biết bơi.**\n\n" +
                  "Mệt làm sức bơi giảm và dễ khiến em không xử lý kịp khi gặp tình huống bất ngờ.\n\n" +
                  "Hãy nghỉ ngơi và chỉ bơi khi cơ thể khỏe, có người lớn giám sát."
    },

    {
        id: "swim_in_bad_weather_with_adult",
        keywords: [
            'có người lớn thì mưa vẫn bơi được không',
            'mua van boi duoc khong',
            'có bố mẹ bơi lúc giông',
            'mưa có cứu hộ vẫn bơi',
            'trời xấu có người lớn'
        ],
        response: "**Không. Thời tiết xấu vẫn là lý do phải dừng bơi.**\n\n" +
                  "Tài liệu quy định không bơi, lội khi trời đang hoặc sắp có mưa to, giông hoặc sét.\n\n" +
                  "Có người lớn đi cùng không làm mất đi nguy cơ từ thời tiết."
    },

    {
        id: "friend_falls_should_jump_immediately",
        keywords: [
            'bạn rơi xuống nước phải nhảy cứu ngay đúng không',
            'ban roi xuong nhay cuu',
            'thấy bạn chìm phải lao xuống',
            'cứu bạn càng nhanh càng phải nhảy',
            'nhảy ngay xuống cứu'
        ],
        response: "**Sai. Nhanh chóng giúp đỡ không có nghĩa là phải nhảy xuống nước.**\n\n" +
                  "Trẻ em cần hô cứu, gọi người lớn và dùng gậy, dây, phao hoặc vật nổi từ vị trí an toàn.\n\n" +
                  "Nhảy xuống trực tiếp có thể khiến em trở thành người gặp nạn thứ hai."
    },

    {
        id: "water_safety_quick_true_false",
        keywords: [
            'đúng hay sai về đuối nước',
            'dung sai duoi nuoc',
            'câu hỏi đúng sai',
            'kiểm tra an toàn nước',
            'đố em phòng đuối nước'
        ],
        response: "**Một số câu đúng – sai dễ nhớ:**\n\n" +
                  "❌ Biết bơi thì xuống đâu cũng được – **SAI**.\n" +
                  "❌ Nước yên luôn an toàn – **SAI**.\n" +
                  "❌ Có áo phao thì không cần người lớn – **SAI**.\n" +
                  "❌ Bạn bơi giỏi có thể thay người lớn giám sát – **SAI**.\n" +
                  "✅ Trẻ em cần bơi ở nơi an toàn và có người lớn giám sát – **ĐÚNG**.\n" +
                  "✅ Thấy bạn đuối nước cần gọi người lớn và hỗ trợ từ trên bờ – **ĐÚNG**."
    },

    ];
const keywordAliases = {

    // 1. KHÁI NIỆM ĐUỐI NƯỚC
    drowning_definition: [
        'duoi nuoc la gi',
        'đuối nc là gì',
        'duoi nc la gi',
        'đuối nước là sao',
        'duoi nuoc la sao',
        'thế nào là đuối nc',
        'tn la duoi nuoc'
    ],

    drowning_can_happen_anywhere: [
        'duoi nuoc o dau',
        'đuối nc ở đâu',
        'o dau cung duoi dc a',
        'đuối nước ở nhà được không',
        'duoi o nha dc k'
    ],

    drowning_is_silent: [
        'duoi nuoc co keu dc k',
        'đuối nc có kêu ko',
        'sao duoi nuoc im',
        'đuối nước có la không',
        'duoi co la dc ko'
    ],


    // 2. ĐỊA ĐIỂM NGUY HIỂM
    dangerous_water_places: [
        'cho nao de duoi nuoc',
        'nơi nào nguy hiểm',
        'cho nuoc nguy hiem',
        'khu nao de duoi',
        'ở đâu dễ đuối nc'
    ],

    pond_river_risk: [
        'ao song co nguy hiem k',
        'tắm ao dc k',
        'xuong song dc ko',
        'sông có nguy hiểm ko',
        'ao có sâu ko'
    ],

    well_risk: [
        'gieng co nguy hiem k',
        'ngã giếng',
        'roi xuong gieng',
        'giếng có đuối ko',
        'choi gan gieng'
    ],

    water_container_risk: [
        'chum nuoc co nguy hiem k',
        'xô nước có đuối ko',
        'chau nuoc co sao k',
        'lu nuoc nguy hiem',
        'ít nước có sao ko'
    ],

    construction_water_hole: [
        'ho cong trinh',
        'hố nước công trình',
        'ho dao co nuoc',
        'hố sâu có nước',
        'choi gan ho cong trinh'
    ],


    // 3. ĐI BƠI / TẮM
    three_no_drowning_rule: [
        '3 khong la gi',
        'ba khong duoi nuoc',
        '3 ko phong duoi nuoc',
        'quy tac 3 khong',
        '3 không gồm gì'
    ],

    only_swim_with_adult: [
        'di boi can nguoi lon k',
        'bơi với ai',
        'boi mot minh dc k',
        'ko co nguoi lon boi dc k',
        'tự đi bơi được ko'
    ],

    safe_place_to_swim: [
        'boi o dau an toan',
        'chỗ nào bơi dc',
        'noi boi an toan',
        'bơi chỗ nào',
        'tam o dau an toan'
    ],

    unsafe_place_to_swim: [
        'cho nao ko dc boi',
        'bơi đâu nguy hiểm',
        'noi nao cam boi',
        'chỗ nào ko dc tắm',
        'tam dau nguy hiem'
    ],

    stop_swimming_when_tired: [
        'dang boi bi met',
        'boi met lam sao',
        'mệt có bơi tiếp ko',
        'het suc khi boi',
        'đuối sức khi bơi'
    ],


    // 4. TRẺ BIẾT BƠI NHƯNG CHỦ QUAN
    known_swimmer_overconfidence: [
        'biet boi roi lo gi',
        'bơi giỏi có đuối ko',
        'biet boi co chet duoi k',
        'bơi giỏi có sao ko',
        'em boi gioi'
    ],

    known_swimmer_can_swim_anywhere: [
        'biet boi xuong dau cung dc k',
        'boi gioi xuong song dc k',
        'biết bơi tắm đâu cũng dc à',
        'boi gioi tam ao dc ko',
        'biết bơi xuống hồ được ko'
    ],


    // 5. ĐI BƠI MỘT MÌNH / ĐI VỚI BẠN
    swimming_alone_danger: [
        'boi mot minh co sao k',
        'đi bơi 1 mình',
        'tam song mot minh',
        'tự bơi một mình',
        'mot minh xuong nuoc'
    ],

    swim_with_good_friend_no_adult: [
        'ban boi gioi di cung dc k',
        'đi với bạn biết bơi',
        'ko co nguoi lon co ban dc k',
        'bạn giỏi bơi trông dc ko',
        'di boi voi ban'
    ],


    // 6. KHỞI ĐỘNG - ĂN UỐNG - MỆT
    no_warmup_before_swimming: [
        'ko khoi dong boi dc k',
        'không khởi động có sao ko',
        'boi luon dc k',
        'xuong nuoc luon',
        'bơi ko khởi động'
    ],

    swimming_after_full_meal: [
        'an no boi dc k',
        'ăn xong đi bơi',
        'vua an xong boi',
        'ăn no tắm được ko',
        'ăn rồi xuống nước'
    ],

    eating_while_swimming: [
        'vua boi vua an',
        'ăn khi đang bơi',
        'an duoi ho boi',
        'bơi ăn đồ ăn dc k',
        'uống khi bơi'
    ],


    // 7. MƯA - GIÔNG - SÉT
    swimming_in_rain: [
        'mua co boi dc k',
        'trời mưa bơi dc ko',
        'mua boi dc ko',
        'đang mưa tắm được không',
        'mưa nhỏ bơi dc k'
    ],

    swimming_when_lightning: [
        'set co boi dc k',
        'sấm sét bơi dc ko',
        'co set boi dc k',
        'trời sét xuống nước',
        'sét có xuống hồ dc k'
    ],

    weather_changes_while_swimming: [
        'dang boi troi mua',
        'bơi gặp mưa',
        'dang boi co sam',
        'đang bơi giông tới',
        'mưa giữa lúc bơi'
    ],

    storm_on_way_home: [
        'di hoc ve gap mua',
        'tan hoc gap giong',
        'đường về bị ngập',
        'mưa ko về dc',
        'đi học về gặp lũ'
    ],


    // 8. NƯỚC LŨ - ĐƯỜNG NGẬP
    do_not_enter_flood_water: [
        'loi nuoc lu dc k',
        'đi qua nước ngập dc ko',
        'nuoc ngap di dc k',
        'lội đường ngập',
        'đi vào nước lũ'
    ],

    open_manhole_flood_risk: [
        'ho ga ngap',
        'cống mất nắp',
        'ho ga mat nap',
        'hố ga dưới nước',
        'đường ngập có cống'
    ],

    electric_shock_flood_water: [
        'nuoc ngap co dien k',
        'điện trong nước',
        'dien giat nuoc ngap',
        'dây điện rơi xuống nước',
        'nước lũ có điện ko'
    ],


    // 9. ÁO PHAO
    life_jacket_on_boat: [
        'di thuyen co can ao phao k',
        'đi tàu mặc phao ko',
        'len ghe co mac phao',
        'đi xuồng cần áo phao',
        'tàu có phải mặc phao'
    ],

    life_jacket_correct_size: [
        'ao phao vua ko',
        'phao rộng có sao',
        'ao phao rong',
        'phao nhỏ dc k',
        'áo phao đúng cỡ'
    ],

    life_jacket_allows_anywhere: [
        'co ao phao xuong dau cung dc k',
        'có phao khỏi sợ à',
        'mac phao boi song dc k',
        'phao là an toàn tuyệt đối à',
        'có phao đi một mình dc ko'
    ],


    // 10. GIAO THÔNG ĐƯỜNG THỦY
    water_transport_safety_general: [
        'di thuyen sao an toan',
        'đi ghe cần nhớ gì',
        'di tau tren song',
        'đi đò an toàn',
        'đi xuồng cần làm gì'
    ],

    overloaded_boat_risk: [
        'thuyen dong nguoi',
        'ghe qua tai',
        'tàu chở đông có sao',
        'thuyền quá tải',
        'đò đông người'
    ],

    do_not_play_on_boat: [
        'choi tren thuyen dc k',
        'đùa trên tàu',
        'chạy trên ghe',
        'nghịch trên thuyền',
        'đi tàu chơi đùa'
    ],

    boat_accident_what_to_do: [
        'thuyen gap nan lam sao',
        'tàu gặp sự cố',
        'ghe bi lat lam gi',
        'đò gặp nạn',
        'tai nạn tàu làm sao'
    ],


    // 11. CHUỘT RÚT
    swimming_cramp_definition: [
        'chuot rut la gi',
        'chuột rút khi bơi',
        'bi co rut',
        'đang bơi bị chuột rút',
        'co chan khi boi'
    ],

    cramp_while_swimming_first_action: [
        'chuot rut lam sao',
        'bi chuot rut khi boi',
        'co rut duoi nuoc',
        'đang bơi co chân',
        'chuột rút xử lý sao'
    ],

    do_not_struggle_cramp: [
        'chuot rut co vung vay k',
        'co rut co dap manh k',
        'chuột rút có quẫy ko',
        'bị co chân có cố bơi ko'
    ],


    // 12. DÒNG CHẢY XA BỜ
    rip_current_definition: [
        'dong rut la gi',
        'dong chay xa bo',
        'rip current la gi',
        'nước kéo ra biển',
        'dòng rút xa bờ'
    ],

    rip_current_signs: [
        'nhan biet dong rut',
        'dấu hiệu dòng rút',
        'lam sao biet dong rut',
        'chỗ biển nào có dòng rút',
        'nước biển kéo ra'
    ],

    rip_current_caught_first_action: [
        'bi dong rut lam sao',
        'bị kéo ra xa bờ',
        'nuoc keo ra bien',
        'bị dòng biển cuốn',
        'dòng rút xử lý sao'
    ],

    rip_current_do_not_swim_against: [
        'boi nguoc dong dc k',
        'bơi thẳng vào bờ dc ko',
        'dòng rút có bơi ngược ko',
        'cố bơi vào bờ',
        'bơi chống dòng'
    ],


    // 13. NƯỚC XOÁY - NƯỚC XIẾT
    water_whirlpool_definition: [
        'nuoc xoay la gi',
        'xoay nuoc la sao',
        'vong xoay nuoc',
        'nước xoáy',
        'dòng xoáy'
    ],

    whirlpool_first_action: [
        'bi nuoc xoay lam sao',
        'gap xoay nuoc',
        'nước xoáy xử lý sao',
        'bi xoay hut',
        'rơi vào xoáy'
    ],

    fast_current_definition: [
        'nuoc xiet la gi',
        'dong xiet',
        'nước chảy mạnh',
        'dòng chảy xiết',
        'nước xiết'
    ],

    do_not_swim_fast_current: [
        'nuoc xiet boi dc k',
        'bơi dòng xiết',
        'nước chảy mạnh tắm dc ko',
        'xuong nuoc xiet',
        'bơi chỗ nước mạnh'
    ],


    // 14. BẤT NGỜ RƠI XUỐNG NƯỚC - TỰ CỨU
    fall_into_water_general: [
        'roi xuong nuoc',
        'rơi xuống nc',
        'nga xuong nuoc',
        'ngã hồ',
        'roi song',
        'lỡ rơi xuống nước'
    ],

    first_thing_when_falling_water: [
        'roi nuoc lam gi',
        'ngã xuống nước làm sao',
        'roi xuong ho lam gi',
        'bị rơi nước phải làm gì',
        'rớt nước làm sao'
    ],

    back_float_self_rescue: [
        'noi ngua sao',
        'nổi ngửa tự cứu',
        'nam ngua duoi nuoc',
        'nổi ngửa khi rơi',
        'cach noi ngua'
    ],

    tread_water_self_rescue: [
        'dung nuoc sao',
        'đứng nước là gì',
        'cach dung nuoc',
        'đứng nước tự cứu',
        'đạp nước sao'
    ],

    call_for_help_falling_water: [
        'roi nuoc keu sao',
        'keu cuu the nao',
        'rơi xuống nước gọi ai',
        'bị rơi hồ kêu cứu',
        'cứu với'
    ],


    // 15. THẤY BẠN BỊ ĐUỐI
    see_drowning_person_general: [
        'ban bi duoi',
        'thấy bạn chìm',
        'ban roi xuong nuoc',
        'nguoi bi duoi lam sao',
        'thấy người đuối'
    ],

    do_not_jump_rescue: [
        'nhay xuong cuu dc k',
        'có nên nhảy cứu bạn',
        'boi ra cuu ban',
        'lao xuong cuu',
        'xuống nước cứu được ko'
    ],

    rescue_from_shore_general: [
        'cuu ban tren bo',
        'cứu người ko xuống nước',
        'cach cuu an toan',
        'cứu từ bờ',
        'giúp bạn bị đuối sao'
    ],

    rescue_with_stick: [
        'dung gay cuu ban',
        'cứu bằng cây',
        'dua sao cuu',
        'gậy cứu người',
        'cành cây cứu bạn'
    ],

    rescue_with_rope: [
        'dung day cuu',
        'ném dây cứu',
        'quang day',
        'dây cứu người',
        'kéo bạn bằng dây'
    ],

    throw_lifebuoy: [
        'nem phao cuu',
        'quăng phao',
        'ném áo phao',
        'phao cứu bạn',
        'ném phao xuống'
    ],

    throw_floating_object: [
        'nem vat noi',
        'can nhua cuu nguoi',
        'thùng nhựa cứu bạn',
        'bóng cứu người',
        'ném chai cứu'
    ],


    // 16. SƠ CẤP CỨU
    after_drowning_rescue_general: [
        'cuu len bo roi sao',
        'vớt lên rồi làm gì',
        'len bo lam gi',
        'sau khi cứu người',
        'người đuối lên bờ'
    ],

    drowning_person_not_breathing: [
        'cuu len ko tho',
        'người đuối không thở',
        'nan nhan ngung tho',
        'ko thấy thở',
        'bất tỉnh không thở'
    ],

    call_115_drowning: [
        'goi 115 luc nao',
        'duoi nuoc goi so may',
        'cấp cứu đuối nước số mấy',
        'goi cap cuu',
        '115 duoi nuoc'
    ],

    cpr_definition_simple: [
        'cpr la gi',
        'CPR là sao',
        'hoi suc tim phoi',
        'hồi sức là gì',
        'ep tim la gi'
    ],

    do_not_upend_drowning_victim: [
        'soc nuoc dc k',
        'xốc nước',
        'doc nguoc nguoi',
        'vác người chạy',
        'dốc cho nước ra'
    ],


    // 17. HỒ BƠI - BIỂN BÁO
    pool_rules_general: [
        'noi quy ho boi',
        'đi bể bơi cần nhớ gì',
        'quy tac be boi',
        'hồ bơi làm gì',
        'luật ở hồ bơi'
    ],

    non_swimmer_pool_area: [
        'ko biet boi o dau',
        'chưa biết bơi xuống đâu',
        'khu ko biet boi',
        'bể nông cho người chưa biết bơi',
        'mới học bơi ở đâu'
    ],

    no_diving_sign: [
        'cam nhay dau',
        'biển cấm nhảy',
        'cam cam dau',
        'không được lao đầu',
        'chỗ cấm nhảy'
    ],

    pool_entry_using_ladder: [
        'xuong be sao',
        'xuống hồ bằng thang',
        'cach xuong be',
        'bám thang xuống hồ',
        'xuống hồ thế nào'
    ],


    // 18. BIẾT BƠI AN TOÀN
    safe_swimming_definition: [
        'biet boi an toan la gi',
        'bơi an toàn là sao',
        'tn la biet boi',
        'bơi sao mới gọi an toàn',
        'biết bơi an toàn'
    ],

    swimming_25m_meaning: [
        'boi 25m la biet boi chua',
        '25m co biet boi k',
        'bơi 25 mét',
        'bơi được 25m',
        '25m là đủ chưa'
    ],

    back_float_90_seconds: [
        'noi 90 giay',
        'nổi ngửa bao lâu',
        '90s noi ngua',
        'nổi 1p30',
        'nổi ngửa 90s'
    ],

    tread_water_90_seconds: [
        'dung nuoc 90s',
        'đứng nước bao lâu',
        '90 giay dung nuoc',
        'đứng nước 1p30',
        'đạp nước 90 giây'
    ],


    // 19. ĐỒ RƠI XUỐNG NƯỚC
    ball_falls_into_water: [
        'bong roi xuong song',
        'bóng rơi xuống nc',
        'bóng xuống hồ',
        'xuong lay bong dc k',
        'bóng rơi xuống ao'
    ],

    toy_falls_into_water: [
        'do roi xuong nuoc',
        'đồ chơi rơi xuống ao',
        'lay do duoi song',
        'điện thoại rơi xuống nước',
        'đồ rơi hồ làm sao'
    ],

    catching_fish_near_water: [
        'bat ca dc k',
        'xuong ao bat ca',
        'đi bắt cá',
        'bắt cá ngoài sông',
        'lội mương bắt cá'
    ],


    // 20. CÁC CÂU HỎI SIÊU NGẮN
    water_safety_quick_true_false: [
        'dung hay sai',
        'đúng sai',
        'do em di',
        'quiz duoi nuoc',
        'cau hoi duoi nuoc',
        'test an toan'
    ]
};
    // Logic xử lý thông minh
    function generateSmartResponse(userQuery) {
        const query = userQuery.toLowerCase().trim();

        // 1. Chống các câu hỏi nguy hiểm
        if (query.includes('nghịch lửa') || query.includes('chế tạo pháo') || query.includes('nhảy cầu')) {
            return "Những hành vi này vô cùng nguy hiểm đến tính mạng của em và mọi người xung quanh, tuyệt đối không được làm theo nhé!";
        }

        // 2. Thuật toán tìm kiếm theo trọng số từ đơn
        const userWords = query.split(/\s+/).filter(w => w.length > 1); // Tách câu hỏi thành các từ
        let bestMatch = null;
        let highestScore = 0;

        KB.forEach(item => {
            let score = 0;
            item.keywords.forEach(kw => {
                const kwLower = kw.toLowerCase();
                
                // CỘNG ĐIỂM: Nếu khớp cả cụm (Ưu tiên cao nhất)
                if (query === kwLower) {
                    score += 150;
                } else if (query.includes(kwLower) || kwLower.includes(query)) {
                    score += 60; 
                }

                // CỘNG ĐIỂM: Nếu khớp từng từ đơn lẻ trong từ khóa
                userWords.forEach(word => {
                    if (kwLower.includes(word)) {
                        score += 10;
                    }
                });
            });

            if (score > highestScore) {
                highestScore = score;
                bestMatch = item;
            }
        });

        // 3. Trả về kết quả nếu tìm thấy mục có điểm cao
        if (bestMatch && highestScore >= 18) {
            return bestMatch.response;
        }

        // 4. Nếu hỏi quá ngắn hoặc không tìm thấy (Fallback)
        return "Xin lỗi em, Endy chưa hiểu rõ câu hỏi này lắm do hơi vắn tắt. Em có thể hỏi mình về **bơi lội an toàn**, **cứu bạn đuối nước**, **cháy nổ và thoát hiểm**, **an toàn giao thông**, **tai nạn thương tích** hoặc các số khẩn cấp (111, 114, 115) nhé! 😊";
    }

    // GIAO DIỆN CHATBOT XANH LÁ MÁT MẮT (#059669) VỚI HIỆU ỨNG PHẬP PHỒNG (PULSE)
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulse-green {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1.08); box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        #ai-chatbot-launcher {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            width: 62px;
            height: 62px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
            border: 2px solid #ffffff;
            transition: transform 0.3s;
            animation: pulse-green 2.2s infinite ease-in-out;
        }
        #ai-chatbot-launcher:hover {
            transform: scale(1.12);
        }

        #ai-chatbot-container {
            position: fixed;
            bottom: 92px;
            right: 20px;
            z-index: 10000;
            width: 410px;
            max-width: 90vw;
            height: 560px;
            max-height: 82vh;
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.18);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #a7f3d0;
            font-family: 'Segoe UI', Arial, sans-serif;
            animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes popIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ai-header {
            background: linear-gradient(135deg, #059669, #047857);
            color: #ffffff;
            padding: 14px 18px;
            font-weight: bold;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .ai-body {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f0fdf4;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scroll-behavior: smooth;
        }
        .ai-msg {
            padding: 12px 15px;
            border-radius: 16px;
            font-size: 13.5px;
            line-height: 1.6;
            max-width: 86%;
            word-wrap: break-word;
        }
        .ai-msg.bot {
            background: #ffffff;
            color: #1f2937;
            align-self: flex-start;
            border-bottom-left-radius: 3px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            border: 1px solid #dcfce7;
            white-space: pre-wrap;
        }
        .ai-msg.user {
            background: #10b981;
            color: #ffffff;
            align-self: flex-end;
            border-bottom-right-radius: 3px;
            box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
        }
        .ai-footer {
            padding: 12px;
            background: #ffffff;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 8px;
        }
        .ai-input {
            flex: 1;
            border: 1px solid #a7f3d0;
            border-radius: 22px;
            padding: 10px 16px;
            outline: none;
            font-size: 13.5px;
            transition: border-color 0.2s;
        }
        .ai-input:focus {
            border-color: #059669;
        }
        .ai-send {
            background: #059669;
            color: #ffffff;
            border: none;
            padding: 0 20px;
            border-radius: 22px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13.5px;
            transition: background 0.2s;
        }
        .ai-send:hover {
            background: #047857;
        }
    `;
    document.head.appendChild(style);

    // TẠO GIAO DIỆN DOM
    const launcher = document.createElement('div');
    launcher.id = 'ai-chatbot-launcher';
    launcher.title = 'Mở Trợ lý AI';
    launcher.innerHTML = `<span style="font-size:32px">🤖</span>`;

    const container = document.createElement('div');
    container.id = 'ai-chatbot-container';
    container.innerHTML = `
        <div class="ai-header">
            <div style="display:flex; align-items:center; gap:10px">
                <span style="font-size:22px">🤖</span>
                <span>${ASSISTANT_NAME}</span>
            </div>
            <span id="ai-close" style="cursor:pointer; font-size:24px; opacity:0.9">&times;</span>
        </div>
        <div class="ai-body" id="ai-body">
            <div class="ai-msg bot">Chào em! 👋 Mình là <b>Endy - Lá chắn an toàn của các bạn nhỏ 🛡️</b>.<br><br>Mình sẽ đồng hành cùng em tìm hiểu về <b>phòng chống đuối nước, an toàn giao thông, phòng cháy chữa cháy và xử lý tai nạn thương tích</b>. Em muốn hỏi Endy điều gì nào? 😊</div>
        </div>
        <div class="ai-footer">
            <input type="text" class="ai-input" id="ai-input" placeholder="Gõ câu hỏi của bạn..." />
            <button class="ai-send" id="ai-send">Gửi</button>
        </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(container);

    const body = container.querySelector('#ai-body');
    const input = container.querySelector('#ai-input');
    const send = container.querySelector('#ai-send');

    launcher.onclick = () => {
        const isOpening = container.style.display !== 'flex';
        container.style.display = isOpening ? 'flex' : 'none';
        if (isOpening) {
            input.focus();
            playTingSound(); // Phát âm thanh Ting Teng phập phồng nhẹ khi mở
        }
    };

    container.querySelector('#ai-close').onclick = () => container.style.display = 'none';

    function addMessage(role, text) {
        const msg = document.createElement('div');
        msg.className = `ai-msg ${role}`;
        msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        addMessage('user', text);
        input.value = '';
        setTimeout(() => { addMessage('bot', generateSmartResponse(text)); }, 250);
    }

    send.onclick = handleSend;
    input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

    // Phát âm thanh ting teng khởi tạo nhẹ khi tải xong bài học sau 1.5s
    setTimeout(() => {
        playTingSound();
    }, 1500);
})();