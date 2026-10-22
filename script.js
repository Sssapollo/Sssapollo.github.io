class LanguageManager {
    constructor() {
        try {
            this.currentLanguage = localStorage.getItem("language") === "zh" ? "zh" : "en";
        } catch {
            this.currentLanguage = "en";
        }
        this.langBtn = document.getElementById("lang-btn");
        this.langText = document.querySelector(".lang-text");
        this.applyLanguage();
        this.bindEvents();
    }

    bindEvents() {
        if (!this.langBtn) {
            return;
        }

        this.langBtn.addEventListener("click", () => {
            this.currentLanguage = this.currentLanguage === "en" ? "zh" : "en";
            this.applyLanguage();
        });
    }

    applyLanguage() {
        document.querySelectorAll("[data-en][data-zh]").forEach((element) => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text !== null) {
                element.textContent = text;
            }
        });

        if (this.langText) {
            this.langText.textContent = this.currentLanguage === "en" ? "中文" : "EN";
        }

        document.documentElement.lang = this.currentLanguage === "zh" ? "zh-CN" : "en";
        try {
            localStorage.setItem("language", this.currentLanguage);
        } catch {
            // Language switching remains available when browser storage is disabled.
        }
        document.dispatchEvent(new CustomEvent("portfolio-language-change", {
            detail: { language: this.currentLanguage }
        }));
    }
}

class MoodtripDemo {
    constructor() {
        this.currentMood = "calm";
        this.conversationMood = null;
        this.chatComplete = false;
        this.messages = document.getElementById("demo-messages");
        this.choices = document.getElementById("demo-choices");
        this.choiceLabel = document.getElementById("demo-choice-label");
        this.result = document.getElementById("demo-result");
        this.restart = document.getElementById("demo-restart");
        this.buttons = Array.from(document.querySelectorAll(".mood-button"));
        this.title = document.getElementById("demo-title");
        this.summary = document.getElementById("demo-summary");
        this.duration = document.getElementById("demo-duration");
        this.distance = document.getElementById("demo-distance");
        this.vibe = document.getElementById("demo-vibe");
        this.stops = document.getElementById("demo-stops");
        this.mapNote = document.getElementById("demo-map-note");
        this.routePath = document.getElementById("demo-route-path");

        this.routes = {
            calm: {
                button: { en: "Calm", zh: "平静" },
                title: { en: "Quiet River Walk", zh: "静谧河岸散步" },
                summary: {
                    en: "A low-pressure route with water, trees, and enough pauses to slow your mind down.",
                    zh: "一条没有压力、节奏缓慢的路线，有河流、树荫和足够的停顿点，让人慢慢放松下来。"
                },
                duration: { en: "75 min", zh: "75 分钟" },
                distance: { en: "4.2 km", zh: "4.2 公里" },
                vibe: { en: "Gentle reset", zh: "柔和放松" },
                mapNote: {
                    en: "Best for evenings after classes or a quiet Sunday walk.",
                    zh: "适合下课后的傍晚，或一个安静的周末下午。"
                },
                path: "M 46 176 C 82 158, 110 132, 160 86 S 236 56, 274 54",
                stops: [
                    {
                        time: { en: "Start", zh: "起点" },
                        name: { en: "Riverside entry", zh: "河岸入口" },
                        detail: { en: "Easy transition from the city into a quieter path.", zh: "从城市空间自然过渡到更安静的步道。" }
                    },
                    {
                        time: { en: "Pause", zh: "停留" },
                        name: { en: "Tree-lined bench", zh: "林荫长椅" },
                        detail: { en: "A deliberate resting point to breathe and reset.", zh: "一个可以坐下来深呼吸、整理状态的停留点。" }
                    },
                    {
                        time: { en: "Finish", zh: "终点" },
                        name: { en: "Small cafe corner", zh: "街角小咖啡馆" },
                        detail: { en: "End with tea or coffee before heading back.", zh: "最后可以喝点茶或咖啡，再慢慢返程。" }
                    }
                ]
            },
            happy: {
                button: { en: "Happy", zh: "开心" },
                title: { en: "Sunlit City Loop", zh: "阳光城市漫游" },
                summary: {
                    en: "A brighter route with open squares, small shops, and photo-friendly moments.",
                    zh: "一条更明亮、更有活力的路线，会经过开放广场、小店和适合拍照的停留点。"
                },
                duration: { en: "90 min", zh: "90 分钟" },
                distance: { en: "5.1 km", zh: "5.1 公里" },
                vibe: { en: "Energetic", zh: "轻快活跃" },
                mapNote: {
                    en: "Good when you want movement, color, and a social atmosphere.",
                    zh: "适合想多走一走、看看热闹、感受城市活力的时候。"
                },
                path: "M 46 176 C 92 156, 124 122, 166 110 S 242 98, 274 54",
                stops: [
                    {
                        time: { en: "Start", zh: "起点" },
                        name: { en: "Market square", zh: "市集广场" },
                        detail: { en: "Start where the city feels open and lively.", zh: "从更开阔、更热闹的城市空间开始。" }
                    },
                    {
                        time: { en: "Middle", zh: "中段" },
                        name: { en: "Design bookstore", zh: "设计书店" },
                        detail: { en: "A short detour for browsing and inspiration.", zh: "绕进去看看书和设计杂志，会很有灵感。" }
                    },
                    {
                        time: { en: "Finish", zh: "终点" },
                        name: { en: "Open-air terrace", zh: "露天平台" },
                        detail: { en: "Wrap up with snacks and a brighter city view.", zh: "最后在露天座位收尾，吃点东西看看城市。 " }
                    }
                ]
            },
            stressed: {
                button: { en: "Stressed", zh: "压力大" },
                title: { en: "Low-Stimulus Recharge", zh: "低刺激恢复路线" },
                summary: {
                    en: "A short, low-decision route designed to reduce noise and mental load.",
                    zh: "一条路径简单、决策负担低的短路线，目的是降低噪音和心理消耗。"
                },
                duration: { en: "55 min", zh: "55 分钟" },
                distance: { en: "3.3 km", zh: "3.3 公里" },
                vibe: { en: "Decompress", zh: "减压恢复" },
                mapNote: {
                    en: "Built for exam weeks, long coding sessions, or overloaded days.",
                    zh: "适合考试周、长时间写代码之后，或者整天过载的时候。"
                },
                path: "M 46 176 C 74 174, 104 156, 156 126 S 218 96, 274 54",
                stops: [
                    {
                        time: { en: "Start", zh: "起点" },
                        name: { en: "Shaded pathway", zh: "树荫步道" },
                        detail: { en: "A quieter entry with less visual clutter.", zh: "从更安静、视觉刺激更少的入口开始。" }
                    },
                    {
                        time: { en: "Pause", zh: "停留" },
                        name: { en: "Waterfront overlook", zh: "临水观景点" },
                        detail: { en: "Pause without needing to choose your next move immediately.", zh: "在这里停一停，不必马上做下一个决定。" }
                    },
                    {
                        time: { en: "Finish", zh: "终点" },
                        name: { en: "Quiet tea spot", zh: "安静茶馆" },
                        detail: { en: "A calm end point before returning to work.", zh: "回去之前，用一个更平静的终点缓冲一下。" }
                    }
                ]
            },
            curious: {
                button: { en: "Curious", zh: "想探索" },
                title: { en: "Hidden Corners Route", zh: "城市角落探索" },
                summary: {
                    en: "A route for discovery, weaving together architecture, side streets, and one surprising stop.",
                    zh: "一条适合探索的小路线，把建筑、支路和一点意外惊喜串在一起。"
                },
                duration: { en: "85 min", zh: "85 分钟" },
                distance: { en: "4.8 km", zh: "4.8 公里" },
                vibe: { en: "Exploratory", zh: "探索感" },
                mapNote: {
                    en: "Best when you want novelty without needing a full-day plan.",
                    zh: "适合想尝试一点新鲜感，但又不想做全天大计划的时候。"
                },
                path: "M 46 176 C 88 148, 126 94, 170 88 S 224 92, 274 54",
                stops: [
                    {
                        time: { en: "Start", zh: "起点" },
                        name: { en: "Historic lane", zh: "历史小巷" },
                        detail: { en: "Begin with tighter streets and architectural texture.", zh: "从更有建筑细节和氛围的小街开始。" }
                    },
                    {
                        time: { en: "Middle", zh: "中段" },
                        name: { en: "Pocket gallery", zh: "小型画廊" },
                        detail: { en: "A compact stop that changes the pace of the walk.", zh: "一个不大却能改变步行节奏的停留点。" }
                    },
                    {
                        time: { en: "Finish", zh: "终点" },
                        name: { en: "Viewpoint staircase", zh: "阶梯观景点" },
                        detail: { en: "End somewhere that makes the route feel earned.", zh: "在一个值得停下来的高点结束，会更有完成感。" }
                    }
                ]
            }
        };

        this.chatCopy = {
            greeting: { en: "Hi, I’m Moodtrip. How are you feeling, and what kind of outing would help today?", zh: "你好，我是 Moodtrip。今天心情怎么样？想用一段怎样的出行来调节一下？" },
            choose: { en: "Choose a message to send", zh: "选择一条消息发送" },
            confirm: { en: "Send a reply to see your route", zh: "选择回复，查看你的路线" },
            send: { en: "Yes, show me the route.", zh: "好呀，看看这条路线。" },
            ready: { en: "Here’s your sample itinerary. You can explore other moods below, too.", zh: "这是为你准备的示例路线。你也可以在下方切换心情，看看其他选择。" },
            you: { en: "You", zh: "你" },
            prompts: {
                calm: { en: "I’m feeling calm. I’d love a quiet walk by the water.", zh: "今天心情很平静，想去水边安静地走走。" },
                happy: { en: "I’m in a great mood! Let’s find somewhere lively to explore.", zh: "今天很开心！想去热闹一点的地方逛逛。" },
                stressed: { en: "It’s been a stressful week. I need a short, peaceful break.", zh: "这周压力有点大，想短暂出门，找个清静的地方放松。" },
                curious: { en: "I’m feeling curious. I’d like to discover some hidden corners.", zh: "今天想探索一下，找找城市里不太起眼的小角落。" }
            },
            replies: {
                calm: { en: "Let’s keep the pace gentle: a riverside path, a shaded bench, and a café to finish. I have a 75-minute walk in mind. Shall I show you?", zh: "那就慢一点：沿河散步，在林荫长椅停一停，最后去街角咖啡馆。大约 75 分钟，要看看路线吗？" },
                happy: { en: "A lively square, a design bookstore, and an open-air terrace could suit you. This city loop takes about 90 minutes. Want to see it?", zh: "热闹的广场、设计书店，再加一个露天平台，应该很适合今天的你。大约 90 分钟，要看看吗？" },
                stressed: { en: "Let’s make it easy: a shaded path, a pause by the water, and a quiet tea spot. A 55-minute break, with few decisions to make. Shall I put it together?", zh: "那就选一条不用费心的路线：树荫步道、临水观景点，再去安静的茶馆。大约 55 分钟，要看看具体安排吗？" },
                curious: { en: "How about a historic lane, a pocket gallery, and a staircase with a view? Around 85 minutes, with a few discoveries along the way. Shall I show you?", zh: "历史小巷、小型画廊，再去能看风景的阶梯怎么样？大约 85 分钟，沿途找点新鲜感。要看看路线吗？" }
            }
        };
        this.choices.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-chat-action]");
            if (!button || !this.choices.contains(button)) return;
            if (button.dataset.chatAction === "show") {
                this.chatComplete = true;
                this.render();
                this.title.focus({ preventScroll: true });
            } else if (Object.hasOwn(this.routes, button.dataset.chatAction)) {
                this.conversationMood = button.dataset.chatAction;
                this.currentMood = this.conversationMood;
                this.render();
                this.choices.querySelector("button").focus({ preventScroll: true });
            }
        });
        this.restart.addEventListener("click", () => {
            this.conversationMood = null;
            this.chatComplete = false;
            this.currentMood = "calm";
            this.render();
            this.choices.querySelector("button").focus({ preventScroll: true });
        });

        this.buttons.forEach((button) => {
            button.addEventListener("click", () => {
                this.currentMood = button.dataset.mood;
                this.render();
            });
        });

        document.addEventListener("portfolio-language-change", () => this.render());
        this.render();
    }

    get language() {
        return document.documentElement.lang === "zh-CN" ? "zh" : "en";
    }

    renderChat() {
        const copy = this.chatCopy;
        const language = this.language;
        const messages = [{ speaker: "Moodtrip", text: copy.greeting[language] }];
        if (this.conversationMood) {
            messages.push(
                { speaker: copy.you[language], text: copy.prompts[this.conversationMood][language], user: true },
                { speaker: "Moodtrip", text: copy.replies[this.conversationMood][language] }
            );
        }
        if (this.chatComplete) {
            messages.push(
                { speaker: copy.you[language], text: copy.send[language], user: true },
                { speaker: "Moodtrip", text: copy.ready[language] }
            );
        }
        this.messages.replaceChildren(...messages.map((message) => {
            const bubble = document.createElement("div");
            bubble.className = `chat-message${message.user ? " chat-message-user" : ""}`;
            const speaker = document.createElement("span");
            speaker.className = "chat-speaker";
            speaker.textContent = message.speaker;
            const text = document.createElement("p");
            text.textContent = message.text;
            bubble.append(speaker, text);
            return bubble;
        }));
        const actions = this.chatComplete ? [] : this.conversationMood ? ["show"] : Object.keys(this.routes);
        this.choices.replaceChildren(...actions.map((action) => {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.chatAction = action;
            button.textContent = action === "show" ? copy.send[language] : copy.prompts[action][language];
            return button;
        }));
        this.choiceLabel.textContent = this.conversationMood ? copy.confirm[language] : copy.choose[language];
        this.choiceLabel.hidden = this.chatComplete;
        this.choices.hidden = this.chatComplete;
        this.restart.hidden = !this.conversationMood;
        this.result.hidden = !this.chatComplete;
    }

    render() {
        this.renderChat();
        const route = this.routes[this.currentMood];
        if (!route) {
            return;
        }

        this.buttons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.mood === this.currentMood);
            button.setAttribute("aria-pressed", String(button.dataset.mood === this.currentMood));
            button.textContent = this.routes[button.dataset.mood].button[this.language];
        });

        this.title.textContent = route.title[this.language];
        this.summary.textContent = route.summary[this.language];
        this.duration.textContent = route.duration[this.language];
        this.distance.textContent = route.distance[this.language];
        this.vibe.textContent = route.vibe[this.language];
        this.mapNote.textContent = route.mapNote[this.language];
        this.routePath.setAttribute("d", route.path);

        this.stops.innerHTML = route.stops.map((stop, index) => `
            <article class="stop-card">
                <div class="stop-topline">
                    <span class="stop-order">${stop.time[this.language]}</span>
                    <span>${String(index + 1).padStart(2, "0")}</span>
                </div>
                <strong>${stop.name[this.language]}</strong>
                <p>${stop.detail[this.language]}</p>
            </article>
        `).join("");
    }
}

function setupNavigation() {
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

    if (!mobileMenu || !navMenu) {
        return;
    }

    mobileMenu.addEventListener("click", () => {
        const open = navMenu.classList.toggle("active");
        mobileMenu.classList.toggle("is-active", open);
        mobileMenu.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("menu-open", open);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            mobileMenu.classList.remove("is-active");
            mobileMenu.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });

    const sections = Array.from(document.querySelectorAll("section[id]"));
    const updateActiveLink = () => {
        const offset = window.scrollY + 140;
        let currentSection = sections[0]?.id || "";

        sections.forEach((section) => {
            if (offset >= section.offsetTop) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const target = link.getAttribute("href")?.replace("#", "");
            link.classList.toggle("active", target === currentSection);
        });
    };

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();
}

document.addEventListener("DOMContentLoaded", () => {
    new LanguageManager();
    new MoodtripDemo();
    setupNavigation();
});
