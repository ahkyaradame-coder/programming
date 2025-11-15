// script for Learn Programming site
(function () {
	// Simple course data; in a real site this would come from an API
	const courses = [
		{ id: 1, title: 'JavaScript Essentials', level: 'beginner', desc: 'Core JS fundamentals and DOM manipulation. Build interactive web apps.' },
		{ id: 2, title: 'Python for Data', level: 'intermediate', desc: 'Learn Python and analyze data with pandas and visualization.' },
		{ id: 3, title: 'Full-Stack Web', level: 'advanced', desc: 'Build and deploy a full-stack app with Node, React, and Postgres.' },
		{ id: 4, title: 'Intro to HTML & CSS', level: 'beginner', desc: 'Foundations of the web: structure, styling, and responsive layouts.' },
		{ id: 5, title: 'APIs & Backends', level: 'intermediate', desc: 'Design RESTful APIs and work with authentication and databases.' },
		{ id: 6, title: 'DevOps Basics', level: 'advanced', desc: 'CI/CD, containers, and deployment best practices for developers.' }
	];

	function byId(id) { return document.getElementById(id) }
	const courseGrid = byId('courseGrid');
	const search = byId('search');
	const levelFilter = byId('levelFilter');
	const heroCTA = byId('heroCTA');
	const startBtn = byId('startBtn');

	function createCard(c) {
		const div = document.createElement('article');
		div.className = 'card';
		div.innerHTML = `
			<h3>${c.title}</h3>
			<p>${c.desc}</p>
			<div class="meta">
				<span class="label">${c.level}</span>
				<span style="flex:1"></span>
				<button class="btn btn-ghost enroll" data-id="${c.id}">View</button>
			</div>
		`;
		return div;
	}

	function render(list) {
		courseGrid.innerHTML = '';
		if (!list.length) {
			courseGrid.innerHTML = '<div class="muted">No courses found.</div>';
			return;
		}
		list.forEach(c => courseGrid.appendChild(createCard(c)));
	}

	function filterCourses() {
		const q = (search.value || '').trim().toLowerCase();
		const level = levelFilter.value;
		const out = courses.filter(c => {
			const inLevel = level === 'all' ? true : c.level === level;
			const inQuery = q === '' ? true : (c.title + ' ' + c.desc).toLowerCase().indexOf(q) !== -1;
			return inLevel && inQuery;
		});
		render(out);
	}

	// FAQ accordion
	function initFAQ() {
		const faqItems = document.querySelectorAll('.faq-item');
		faqItems.forEach(btn => {
			btn.addEventListener('click', () => {
				btn.classList.toggle('open');
			});
		});
	}

	// smooth scrolling for hero CTAs
	function smoothTo(selector) {
		const el = document.querySelector(selector);
		if (!el) return;
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// wire events
	document.addEventListener('DOMContentLoaded', () => {
		render(courses);
		initFAQ();
		byId('year').textContent = new Date().getFullYear();

		// Mobile menu toggle
		const menuToggle = byId('menuToggle');
		const navMenu = byId('navMenu');
		if (menuToggle && navMenu) {
			menuToggle.addEventListener('click', () => {
				const isOpen = navMenu.classList.toggle('active');
				menuToggle.setAttribute('aria-expanded', isOpen);
			});
			// Close menu when a nav link is clicked
			navMenu.querySelectorAll('a').forEach(link => {
				link.addEventListener('click', () => {
					navMenu.classList.remove('active');
					menuToggle.setAttribute('aria-expanded', 'false');
				});
			});
		}

		search.addEventListener('input', debounce(filterCourses, 180));
		levelFilter.addEventListener('change', filterCourses);

		heroCTA.addEventListener('click', () => smoothTo('#courses'));
		startBtn && startBtn.addEventListener('click', () => smoothTo('#courses'));

		// contact form simple handler
		const contactForm = byId('contactForm');
		contactForm.addEventListener('submit', (ev) => {
			ev.preventDefault();
			const name = byId('name').value || 'Friend';
			alert(`Thanks, ${name}! We'll get back to you soon.`);
			contactForm.reset();
		});

		// delegate view/enroll buttons
		courseGrid.addEventListener('click', (ev) => {
			const btn = ev.target.closest('.enroll');
			if (!btn) return;
			const id = btn.dataset.id;
			const course = courses.find(c => String(c.id) === String(id));
			if (course) alert(`${course.title}\n\n${course.desc}`);
		});
		// Generate JSON-LD structured data dynamically from the courses array
		try {
			injectStructuredData(courses);
		} catch (e) {
			// if structured data fails we don't want to break the page
			console.warn('Structured data injection failed', e);
		}

		// Initialize dimmer controls
		initDimmer();

		// Subscribe button on pricing
		const subscribeBtn = document.getElementById('subscribeBtn');
		if (subscribeBtn) {
			subscribeBtn.addEventListener('click', () => {
				const user = window.Auth.getCurrentUser();
				if (!user) {
					// redirect to login if not signed in
					window.location.href = 'login.html';
					return;
				}
				// start PayPal flow
				startPayPalCheckout(100, user.email || '');
			});
		}

		// auto-start subscribe flow if URL contains ?subscribe=1
		try {
			const params = new URLSearchParams(window.location.search);
			if (params.get('subscribe') === '1') {
				const user = window.Auth.getCurrentUser();
				if (user) startPayPalCheckout(100, user.email || '');
				else window.location.href = 'login.html?subscribe=1';
			}
		} catch (e) {/* ignore */ }

		// Feedback widget wiring
		const openFeedback = byId('openFeedback');
		const feedbackFormWrap = byId('feedbackFormWrap');
		const feedbackForm = byId('feedbackForm');
		const feedbackStars = byId('feedbackStars');
		const feedbackComment = byId('feedbackComment');
		const feedbackSubmit = byId('feedbackSubmit');
		const feedbackAvg = byId('feedbackAvg');
		const feedbackCount = byId('feedbackCount');
		const feedbackList = byId('feedbackList');
		let selectedRating = 0;

		function loadFeedback() {
			const data = JSON.parse(localStorage.getItem('siteFeedback') || '[]');
			renderFeedback(data);
			updateSummary(data);
		}

		function _escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c]; }); }

		function saveFeedbackItem(item) {
			const arr = JSON.parse(localStorage.getItem('siteFeedback') || '[]');
			arr.unshift(item);
			localStorage.setItem('siteFeedback', JSON.stringify(arr));
			renderFeedback(arr);
			updateSummary(arr);
		}

		function updateSummary(arr) {
			if (!arr || !arr.length) { feedbackAvg.textContent = 'No ratings yet'; feedbackCount.textContent = 'Be the first to rate'; return; }
			const count = arr.length;
			const avg = (arr.reduce((s, it) => s + Number(it.rating || 0), 0) / count).toFixed(2);
			feedbackAvg.textContent = `${avg} ★ average`;
			feedbackCount.textContent = `${count} rating${count > 1 ? 's' : ''}`;
		}

		function renderFeedback(arr) {
			if (!feedbackList) return;
			feedbackList.innerHTML = '';
			if (!arr || !arr.length) return;
			arr.forEach(it => {
				const node = document.createElement('div'); node.className = 'feedback-item';
				node.innerHTML = `<div class="meta"><strong>${_escapeHtml(it.name || 'Anonymous')}</strong> • ${it.rating} ★ • <span class="muted">${new Date(it.t).toLocaleString()}</span></div><div>${_escapeHtml(it.comment || '')}</div>`;
				feedbackList.appendChild(node);
			});
		}

		if (openFeedback) openFeedback.addEventListener('click', () => { if (!feedbackFormWrap) return; feedbackFormWrap.style.display = (feedbackFormWrap.style.display === 'none' || feedbackFormWrap.style.display === '') ? 'block' : 'none'; });

		if (feedbackStars) {
			feedbackStars.querySelectorAll('.star').forEach(btn => {
				btn.addEventListener('click', () => {
					selectedRating = Number(btn.dataset.value || 0);
					feedbackStars.querySelectorAll('.star').forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= selectedRating));
				});
			});
		}

		if (feedbackForm) {
			feedbackForm.addEventListener('submit', (ev) => {
				ev.preventDefault();
				const comment = (feedbackComment && feedbackComment.value || '').trim();
				const name = (byId('name') && byId('name').value) || 'Guest';
				if (!selectedRating) { alert('Please select a rating 1-5'); return; }
				const item = { rating: selectedRating, comment: comment, name: name, t: new Date().toISOString() };
				saveFeedbackItem(item);
				if (feedbackComment) feedbackComment.value = ''; selectedRating = 0;
				if (feedbackStars) feedbackStars.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
				if (feedbackFormWrap) feedbackFormWrap.style.display = 'none';
				alert('Thanks for your feedback!');
			});
		}

		loadFeedback();

	});

	function debounce(fn, wait) {
		let t;
		return function () {
			clearTimeout(t);
			t = setTimeout(() => fn.apply(this, arguments), wait);
		};

		// Simulated subscription purchase API: attaches subscription data to authUser
		window.Auth.purchaseSubscription = function (amount, period) {
			return new Promise((resolve) => {
				const user = window.Auth.getCurrentUser();
				if (!user) { resolve(null); return; }
				const now = new Date();
				const expires = new Date(now.getTime());
				if (period === 'year' || period === 'annual') {
					expires.setFullYear(expires.getFullYear() + 1);
				} else if (typeof period === 'number') {
					expires.setDate(expires.getDate() + Number(period));
				}
				user.subscription = { plan: 'annual', price: Number(amount), expires: expires.toISOString() };
				localStorage.setItem('authUser', JSON.stringify(user));
				resolve(user.subscription);
			});
		};
	}

	/* Structured Data: create JSON-LD for Organization, WebSite and Course items.
		 This improves search engines' understanding of the site and courses. */
	function injectStructuredData(courseList) {
		const domain = 'https://example.com'; // <-- Replace with your production domain
		const coursesLd = courseList.map(c => ({
			'@type': 'Course',
			'name': c.title,
			'description': c.desc,
			'provider': {
				'@type': 'Organization',
				'name': 'CodeLearn',
				'sameAs': domain
			},
			'url': `${domain}/code.html#course-${c.id}`
		}));

		const ld = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebSite',
					'name': 'CodeLearn',
					'url': domain,
					'potentialAction': {
						'@type': 'SearchAction',
						'target': `${domain}/?q={search_term_string}`,
						'query-input': 'required name=search_term_string'
					}
				},
				{
					'@type': 'Organization',
					'name': 'CodeLearn',
					'url': domain
				},
				...coursesLd
			]
		};

		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(ld, null, 2);
		document.head.appendChild(script);
	}

	/* Dimmer / Brighten Controls */
	function initDimmer() {
		const step = 0.15; // opacity step per press
		const min = 0; const max = 0.95;
		let dimmer = document.getElementById('dimmer');
		if (!dimmer) {
			dimmer = document.createElement('div');
			dimmer.id = 'dimmer';
			dimmer.setAttribute('aria-hidden', 'true');
			document.body.appendChild(dimmer);
		}

		// read stored opacity
		let current = parseFloat(localStorage.getItem('site-dimmer-opacity') || '0');
		current = clamp(current, min, max);
		applyOpacity(current);

		const darkBtn = document.getElementById('darkenBtn');
		const lightBtn = document.getElementById('brightenBtn');

		darkBtn && darkBtn.addEventListener('click', () => {
			current = clamp(current + step, min, max);
			applyOpacity(current);
		});

		lightBtn && lightBtn.addEventListener('click', () => {
			current = clamp(current - step, min, max);
			applyOpacity(current);
		});


		/* --- Authentication helpers (client-side demo) --- */
		// Expose a small Auth API for the demo pages (login.html)
		window.Auth = {
			getCurrentUser: function () {
				try { return JSON.parse(localStorage.getItem('authUser') || 'null'); } catch (e) { return null }
			},
			signInWithEmail: function (email, name) {
				return new Promise((resolve) => {
					const user = { name: name || email.split('@')[0], email, provider: 'email' };
					localStorage.setItem('authUser', JSON.stringify(user));
					updateUserArea();
					resolve(user);
				});
			},
			signInWithGoogle: function () {
				return new Promise((resolve) => {
					// Demo: simulated Google sign-in. In real integration, open OAuth flow.
					const user = { name: 'Google User', email: 'user@gmail.com', provider: 'google' };
					localStorage.setItem('authUser', JSON.stringify(user));
					updateUserArea();
					resolve(user);
				});
			},
			signOut: function () {
				localStorage.removeItem('authUser');
				updateUserArea();
			}
		};

		function updateUserArea() {
			const ua = document.getElementById('userArea');
			if (!ua) return;
			const user = window.Auth.getCurrentUser();
			if (user) {
				const sub = user.subscription && user.subscription.expires ? ('<span class="sub-badge">' + (user.subscription.plan || 'Member') + ' • ' + (new Date(user.subscription.expires).toLocaleDateString()) + '</span>') : '';
				ua.innerHTML = `
					<span style="display:inline-flex;align-items:center;gap:8px">
					  <span style="background:linear-gradient(90deg,#5a3bff,#00c2a8);width:36px;height:36px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:700">${(user.name || 'U').charAt(0).toUpperCase()}</span>
					  <strong style="color:var(--muted)">${escapeHtml(user.name || 'Member')}</strong>
					</span>
					${sub}
					<button id="logoutBtn" class="btn btn-ghost" style="margin-left:10px">Logout</button>
				`;
				const logoutBtn = document.getElementById('logoutBtn');
				logoutBtn && logoutBtn.addEventListener('click', () => { window.Auth.signOut(); });
			} else {
				ua.innerHTML = `<a id="loginLink" class="btn btn-ghost" href="login.html">Login</a>`;
			}
		}

		function escapeHtml(s) {
			return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
		}

		// ensure header reflects auth state as soon as possible
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			setTimeout(updateUserArea, 0);
		} else {
			document.addEventListener('DOMContentLoaded', updateUserArea);
		}

		// PayPal Checkout integration (client + server)
		let _paypalLoaded = false;
		function loadPayPalSdk(clientId) {
			return new Promise((resolve, reject) => {
				if (_paypalLoaded) return resolve(window.paypal);
				const s = document.createElement('script');
				s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD`;
				s.onload = () => { _paypalLoaded = true; resolve(window.paypal); };
				s.onerror = reject;
				document.head.appendChild(s);
			});
		}

		async function startPayPalCheckout(amount, buyerEmail) {
			try {
				const cfg = await fetch('/api/config').then(r => r.json());
				if (!cfg.clientId) throw new Error('PayPal client id not configured on server');
				const paypal = await loadPayPalSdk(cfg.clientId);
				const container = document.getElementById('paypalContainer');
				container.style.display = 'block'; container.innerHTML = '';
				paypal.Buttons({
					createOrder: async function () {
						const resp = await fetch('/api/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: amount, email: buyerEmail }) });
						const data = await resp.json();
						if (data && data.id) return data.id;
						throw new Error('Failed to create order');
					},
					onApprove: async function (data) {
						// capture on server
						try {
							const resp = await fetch('/api/capture-order', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ orderID: data.orderID })
							});
							const result = await resp.json();
							// for demo: if capture succeeded, grant subscription locally
							if (result && (result.status === 'COMPLETED' || (result.purchase_units && result.purchase_units[0] && result.purchase_units[0].payments))) {
								// store subscription locally for demo purposes
								if (window.Auth && typeof window.Auth.purchaseSubscription === 'function') {
									await window.Auth.purchaseSubscription(amount, 'year');
									updateUserArea();
									alert('Payment captured. Your subscription is active.');
								} else {
									alert('Payment captured. (Demo)');
								}
							} else {
								console.warn('Capture response', result);
								alert('Payment captured (response received).');
							}
						} catch (err) {
							console.error('Capture failed', err);
							alert('Payment capture failed: ' + (err.message || err));
						}
					}
				}).render('#paypalContainer');
			} catch (err) {
				console.error('PayPal error', err); alert('PayPal checkout failed: ' + err.message);
			}
		}
		// keyboard shortcuts: D = darken, L = lighten, 0 = reset
		document.addEventListener('keydown', (ev) => {
			if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
			if (ev.key === 'd' || ev.key === 'D') {
				ev.preventDefault(); current = clamp(current + step, min, max); applyOpacity(current);
			}
			if (ev.key === 'l' || ev.key === 'L') {
				ev.preventDefault(); current = clamp(current - step, min, max); applyOpacity(current);
			}
			if (ev.key === '0') {
				ev.preventDefault(); current = 0; applyOpacity(current);
			}
		});

		function applyOpacity(val) {
			const o = clamp(val, min, max);
			dimmer.style.background = `rgba(0,0,0,${o})`;
			dimmer.style.opacity = o > 0 ? '1' : '0';
			localStorage.setItem('site-dimmer-opacity', String(o));
			// update aria-live for assistive tech (not announcing numeric detail to avoid noise)
			if (o === 0) {
				dimmer.removeAttribute('aria-label');
			} else {
				dimmer.setAttribute('aria-label', `Screen dimmed`);
			}
		}

		function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
	}

	/* --- AI Tutor frontend (client) --- */
	function createAiMessage(text, who) {
		who = typeof who === 'undefined' ? 'ai' : who;
		const container = document.getElementById('aiMessages');
		if (!container) return;
		const el = document.createElement('div');
		el.className = 'msg ' + (who === 'user' ? 'user' : 'ai');
		const bubble = document.createElement('div');
		bubble.className = 'bubble ' + (who === 'user' ? 'user' : 'ai');
		bubble.textContent = text;
		el.appendChild(bubble);
		container.appendChild(el);
		container.scrollTop = container.scrollHeight;
	}

	function aiAsk(question) {
		if (!question) return;
		createAiMessage(question, 'user');
		// Try server-side AI proxy first
		fetch('/api/ai', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: [{ role: 'user', content: question }] })
		})
			.then(r => r.ok ? r.json() : Promise.reject(r))
			.then(data => {
				const reply = (data && (data.reply || (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content))) || 'Sorry, I could not produce an answer.';
				createAiMessage(reply, 'ai');
			})
			.catch(err => {
				console.warn('AI proxy error', err);
				const canned = cannedAiResponse(question);
				createAiMessage(canned, 'ai');
			});
	}

	function cannedAiResponse(q) {
		const s = String(q).toLowerCase();
		if (s.includes('exercise') || s.includes('practice')) {
			return 'Try this exercise: build a function that takes an array of numbers and returns the median. Write tests for edge cases like even-length arrays and empty arrays.';
		}
		if (s.includes('explain') && s.includes('array')) {
			return 'An array is an ordered collection. In JavaScript you can create one with [1,2,3]. Access elements by index (0-based), e.g. arr[0]. Use methods like push, pop, map, filter to operate on arrays.';
		}
		if (s.includes('hello') || s.includes('hi')) return 'Hi — I can explain concepts, generate exercises, or help debug code. Ask me anything about programming.';
		return "I'm a demo AI tutor. For deeper answers connect the server to OpenAI (set OPENAI_API_KEY). Meanwhile, try asking 'Give me an exercise' or 'Explain arrays'.";
	}

	// Wire chat UI
	(function wireAiUi() {
		const aiToggle = document.getElementById('aiToggle');
		const aiTutor = document.getElementById('aiTutor');
		const aiClose = document.getElementById('aiClose');
		const aiForm = document.getElementById('aiForm');
		const aiInput = document.getElementById('aiInput');

		if (aiToggle && aiTutor) {
			aiToggle.addEventListener('click', () => { aiTutor.setAttribute('aria-hidden', 'false'); aiTutor.style.display = 'flex'; aiInput && aiInput.focus(); });
		}
		if (aiClose) { aiClose.addEventListener('click', () => { aiTutor.setAttribute('aria-hidden', 'true'); aiTutor.style.display = 'none'; }); }
		if (aiForm) { aiForm.addEventListener('submit', (ev) => { ev.preventDefault(); const q = aiInput.value.trim(); if (!q) return; aiInput.value = ''; aiAsk(q); }); }
		// keyboard to open tutor (T)
		document.addEventListener('keydown', (ev) => { if (ev.key === 't' || ev.key === 'T') { if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return; ev.preventDefault(); aiToggle && aiToggle.click(); } });
	})();

})();