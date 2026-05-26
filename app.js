/* Event RSVP app — offline client-side behavior
	 - Stores RSVPs in localStorage
	 - Validates email and guests (1-10)
	 - Renders list with per-item delete
	 - Exports CSV and clears all with confirmation
*/

(() => {
	const STORAGE_KEY = 'event_rsvp_list_v1';

	// Elements
	const form = document.getElementById('rsvp-form');
	const nameInput = document.getElementById('name');
	const emailInput = document.getElementById('email');
	const guestsInput = document.getElementById('guests');
	const statusEl = document.getElementById('form-status');
	const attendeesBody = document.getElementById('attendees-body');
	const exportBtn = document.getElementById('export-csv');
	const clearBtn = document.getElementById('clear-all');

	function readStorage() {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		} catch (e) {
			console.error('Failed to read storage', e);
			return [];
		}
	}

	function writeStorage(list) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	}

	function showMessage(message, type = 'success') {
		statusEl.textContent = message;
		statusEl.className = type === 'error' ? 'msg msg--error' : 'msg msg--success';
		// Clear after a short delay
		window.clearTimeout(showMessage._t);
		showMessage._t = setTimeout(() => {
			statusEl.textContent = '';
			statusEl.className = '';
		}, 4000);
	}

	function validateEmail(email) {
		// Simple, practical regex — good for client-side validation
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	function validateGuests(value) {
		const n = parseInt(value, 10);
		return Number.isInteger(n) && n >= 1 && n <= 10;
	}

	function renderList() {
		const list = readStorage();
		attendeesBody.innerHTML = '';

		if (list.length === 0) {
			const tr = document.createElement('tr');
			const td = document.createElement('td');
			td.colSpan = 4;
			td.textContent = 'No RSVPs yet.';
			td.style.color = '#6b7280';
			tr.appendChild(td);
			attendeesBody.appendChild(tr);
			return;
		}

		list.forEach(item => {
			const tr = document.createElement('tr');

			const tdName = document.createElement('td');
			tdName.textContent = item.name;

			const tdEmail = document.createElement('td');
			tdEmail.textContent = item.email;

			const tdGuests = document.createElement('td');
			tdGuests.textContent = item.guests;

			const tdTime = document.createElement('td');
			tdTime.textContent = formatTime(item.time);

			const tdActions = document.createElement('td');
			tdActions.style.whiteSpace = 'nowrap';

			const del = document.createElement('button');
			del.type = 'button';
			del.textContent = 'Delete';
			del.className = 'btn btn--danger';
			del.setAttribute('aria-label', `Delete RSVP for ${item.name}`);
			del.dataset.id = item.id;

			tdActions.appendChild(del);

			tr.appendChild(tdName);
			tr.appendChild(tdEmail);
			tr.appendChild(tdGuests);
			tr.appendChild(tdTime);
			tr.appendChild(tdActions);

			attendeesBody.appendChild(tr);
		});
	}

	function formatTime(iso) {
		try {
			const d = new Date(iso);
			return d.toLocaleString();
		} catch (e) {
			return iso;
		}
	}

	function addRsvp({ name, email, guests }) {
		const list = readStorage();
		const item = {
			id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
			name: name.trim(),
			email: email.trim(),
			guests: Number(guests),
			time: new Date().toISOString()
		};
		list.unshift(item);
		writeStorage(list);
		renderList();
		showMessage('RSVP added.', 'success');
	}

	function deleteRsvp(id) {
		let list = readStorage();
		const before = list.length;
		list = list.filter(r => r.id !== id);
		if (list.length === before) return; // not found
		writeStorage(list);
		renderList();
		showMessage('RSVP removed.', 'success');
	}

	function exportCsv() {
		const list = readStorage();
		if (!list.length) {
			showMessage('No RSVPs to export.', 'error');
			return;
		}

		const rows = [ ['Name','Email','Guests','Time'] ];
		list.forEach(r => {
			rows.push([r.name, r.email, String(r.guests), formatTime(r.time)]);
		});

		const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'rsvps.csv';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
		showMessage('CSV exported.', 'success');
	}

	function escapeCsv(field) {
		if (field == null) return '';
		const s = String(field).replace(/"/g, '""');
		return `"${s}"`;
	}

	function clearAll() {
		const ok = confirm('Clear all RSVPs? This cannot be undone.');
		if (!ok) return;
		localStorage.removeItem(STORAGE_KEY);
		renderList();
		showMessage('All RSVPs cleared.', 'success');
	}

	// Event listeners
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = nameInput.value || '';
		const email = emailInput.value || '';
		const guests = guestsInput.value || '';

		if (!name.trim()) { showMessage('Please enter your name.', 'error'); nameInput.focus(); return; }
		if (!validateEmail(email)) { showMessage('Please enter a valid email.', 'error'); emailInput.focus(); return; }
		if (!validateGuests(guests)) { showMessage('Guests must be an integer between 1 and 10.', 'error'); guestsInput.focus(); return; }

		addRsvp({ name, email, guests });
		form.reset();
		// set focus back to name for quick entry
		nameInput.focus();
	});

	attendeesBody.addEventListener('click', (e) => {
		const btn = e.target.closest('button');
		if (!btn) return;
		const id = btn.dataset.id;
		if (!id) return;
		deleteRsvp(id);
	});

	exportBtn.addEventListener('click', exportCsv);
	clearBtn.addEventListener('click', clearAll);

	// Initial render
	document.addEventListener('DOMContentLoaded', () => {
		renderList();
	});

})();
