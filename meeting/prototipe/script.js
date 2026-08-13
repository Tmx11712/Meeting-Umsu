      let currentRole = "umum",
        recOn = false,
        recSec = 0,
        recInt = null,
        tandaiN = 0;

      const roleConfig = {
        umum: {
          name: "Bag. Umum",
          role: "Admin rapat",
          av: "BU",
          avc: "success",
          pages: [
            "dashboard",
            "rapat",
            "koreksi",
            "absensi",
            "notulen",
            "laporan",
          ],
        },
        humas: {
          name: "Bag. Humas",
          role: "Operator rekaman",
          av: "HU",
          avc: "warning",
          pages: ["humas", "absensi"],
        },
        pimpinan: {
          name: "Pimpinan",
          role: "Monitor & review",
          av: "PM",
          avc: "info",
          pages: ["dashboard", "notulen", "laporan"],
        },
        viewer: {
          name: "Viewer",
          role: "Baca notulen",
          av: "VW",
          avc: "gray",
          pages: ["notulen"],
        },
      };

      function loginAs(r) {
        currentRole = r;
        const cfg = roleConfig[r];
        document.getElementById("login-page").style.display = "none";
        document.getElementById("app").style.display = "flex";

        document.getElementById("topbar-role").textContent = cfg.name;
        document.getElementById("topbar-avatar").textContent = cfg.av;
        document.getElementById("sidebar-name").textContent = cfg.name;
        document.getElementById("sidebar-role").textContent = cfg.role;
        document.getElementById("sidebar-avatar").textContent = cfg.av;

        const allPages = [
          "dashboard",
          "rapat",
          "humas",
          "koreksi",
          "absensi",
          "notulen",
          "laporan",
          "settings",
        ];
        allPages.forEach((p) => {
          const n = document.getElementById("nav-" + p);
          if (n) n.style.display = cfg.pages.includes(p) ? "flex" : "none";
        });

        const brt = document.getElementById("btn-buat-rapat");
        if (brt) brt.style.display = r === "umum" ? "flex" : "none";

        const defaultPage = {
          umum: "dashboard",
          humas: "humas",
          pimpinan: "laporan",
          viewer: "notulen",
        };
        showPage(defaultPage[r]);

        // Fetch recent rapat when landing on dashboard in demo
        if (defaultPage[r] === "dashboard") fetchRapatList();

        const stepOnLogin = { umum: 2, humas: 3, pimpinan: 6, viewer: 5 };
        markStep(stepOnLogin[r]);
      }

      function showPage(p) {
        document
          .querySelectorAll(".page")
          .forEach((el) => el.classList.remove("active"));
        document
          .querySelectorAll(".nav-item")
          .forEach((el) => el.classList.remove("active"));
        const pg = document.getElementById("page-" + p);
        if (pg) pg.classList.add("active");
        const nv = document.getElementById("nav-" + p);
        if (nv) nv.classList.add("active");
      }

      function gotoStep(n) {
        if (n === 1) {
          document.getElementById("app").style.display = "none";
          document.getElementById("login-page").style.display = "flex";
          markStep(1);
          return;
        }
        const stepRole = {
          2: "umum",
          3: "humas",
          4: "umum",
          5: "umum",
          6: "pimpinan",
        };
        const stepPage = {
          2: "rapat",
          3: "humas",
          4: "absensi",
          5: "notulen",
          6: "laporan",
        };
        const needRole = stepRole[n];
        if (needRole && needRole !== currentRole) loginAs(needRole);
        showPage(stepPage[n]);
        markStep(n);
      }

      function markStep(current) {
        for (let i = 1; i <= 6; i++) {
          const el = document.getElementById("ds-" + i);
          if (!el) continue;
          const dot = el.querySelector(".step-num");
          if (i < current) {
            el.className = "step-btn done";
            if (dot)
              dot.innerHTML =
                '<i class="ti ti-check" style="font-size:9px"></i>';
          } else if (i === current) {
            el.className = "step-btn active";
            if (dot) dot.textContent = i;
          } else {
            el.className = "step-btn";
            if (dot) dot.textContent = i;
          }
        }
      }

      async function doSimpanRapat() {
        const btn = document.getElementById("btn-simpan-rapat");
        btn.disabled = true;
        btn.textContent = "Menyimpan...";

        const payload = {
          judul: document.getElementById("rapat-judul").value,
          tipe: document.getElementById("rapat-tipe").value,
          tanggal: document.getElementById("rapat-tanggal").value,
          jam_mulai: document.getElementById("rapat-jam-mulai").value,
          jam_selesai: document.getElementById("rapat-jam-selesai").value,
          ruangan: document.getElementById("rapat-ruangan").value,
          agenda: [],
          peserta_ids: [],
        };

        try {
          const res = await fetch(
            (window.__BACKEND_ORIGIN || "http://localhost:3001") + "/api/rapat",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            },
          );
          const body = await res.json();
          if (!res.ok) throw new Error(body.error || "Gagal membuat rapat");

          btn.innerHTML = '<i class="ti ti-check"></i> Tersimpan!';
          btn.style.background = "var(--success)";
          btn.style.borderColor = "var(--success)";
          showToast("Jadwal rapat berhasil dibuat");
          // refresh list
          fetchRapatList();
          setTimeout(() => showPage("dashboard"), 900);
        } catch (err) {
          console.error("Error simpan rapat:", err);
          showToast("Gagal membuat jadwal: " + (err.message || "server error"));
          btn.disabled = false;
          btn.textContent = "Simpan & kirim undangan";
        }
      }

      async function fetchRapatList() {
        try {
          const res = await fetch(
            (window.__BACKEND_ORIGIN || "http://localhost:3001") + "/api/rapat",
          );
          const body = await res.json();
          if (!res.ok) throw new Error(body.error || "Gagal ambil data");
          const data = body.data || [];
          renderRecentRapat(data.slice(0, 5));
        } catch (err) {
          console.error("fetchRapatList error", err);
        }
      }

      function renderRecentRapat(list) {
        const card = document.getElementById("recent-rapat-card");
        if (!card) return;
        const rows = list
          .map((r) => {
            const pesertaCount = r.peserta_rapat ? r.peserta_rapat.length : 0;
            const status = r.status || "terjadwal";
            const badge =
              status === "terjadwal"
                ? '<span class="badge badge-live"><span class="live-dot"></span>Live</span>'
                : status === "selesai"
                  ? '<span class="badge badge-success">Selesai</span>'
                  : '<span class="badge badge-warning">' + status + "</span>";
            return `<div class="rapat-row" onclick="gotoStep(5)"><div class="rapat-icon" style="background:var(--info-bg)"><i class="ti ti-calendar-event" style="color:var(--info)"></i></div><div style="flex:1"><div style="font-size:13px;font-weight:500">${escapeHtml(r.judul || "—")}</div><div style="font-size:11px;color:var(--text-2)">${escapeHtml(r.tanggal || "")} · ${escapeHtml(r.jam_mulai || "")}–${escapeHtml(r.jam_selesai || "")} · ${pesertaCount} peserta</div></div>${badge}</div>`;
          })
          .join("");
        // replace inner rows (keep title)
        const titleEl = card.querySelector(".card-title");
        card.innerHTML = titleEl.outerHTML + rows;
      }

      function escapeHtml(s) {
        return String(s || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }

      function doPublish() {
        const publishBtn = document.getElementById("btn-publish");
        if (publishBtn && publishBtn.disabled) {
          showToast(
            "Notulen belum disetujui pimpinan — publikasi belum dapat dilakukan",
          );
          return;
        }
        const badge = document.getElementById("notulen-status-badge");
        const btn = document.getElementById("btn-publish");
        const nc = document.getElementById("notulen-count");
        if (badge) {
          badge.className = "badge badge-success";
          badge.textContent = "Published";
        }
        if (btn) {
          btn.innerHTML = '<i class="ti ti-check"></i> Dipublikasi';
          btn.style.background = "var(--success)";
          btn.style.borderColor = "var(--success)";
          btn.disabled = true;
        }
        if (nc) nc.style.display = "none";
        showToast(
          "Notulen dipublikasi · Email dikirim ke semua peserta & pimpinan",
        );
      }

      let openaiApiKey = "";
      let lastNotulenResult = null;
      let rawTranscriptPending = "";

      function saveWebhookUrl() {
        const input = document.getElementById("openai-api-key");
        openaiApiKey = input.value.trim();
        const badge = document.getElementById("n8n-conn-badge");
        if (openaiApiKey) {
          badge.className = "badge badge-success";
          badge.textContent = "API key tersimpan";
          showToast("API key OpenAI disimpan untuk sesi ini");
        } else {
          badge.className = "badge badge-gray";
          badge.textContent = "Belum terhubung";
        }
      }

      document
        .getElementById("audio-file-input")
        ?.addEventListener("change", function (e) {
          const f = e.target.files[0];
          document.getElementById("audio-file-name").textContent = f
            ? f.name + " · " + (f.size / 1024 / 1024).toFixed(2) + " MB"
            : "Belum ada file dipilih";
        });

      async function transcribeSingleFile(fileOrBlob, apiKey) {
        const formData = new FormData();
        formData.append("file", fileOrBlob, "segment.wav");
        formData.append("model", "whisper-1");
        formData.append("language", "id");

        const response = await fetch(
          "https://api.openai.com/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: "Bearer " + apiKey },
            body: formData,
          },
        );

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(
            "Whisper API gagal (status " + response.status + "): " + errBody,
          );
        }

        const result = await response.json();
        return result.text || "";
      }

      async function splitAudioFile(file, statusTextEl) {
        statusTextEl.textContent = "Membaca dan mendekode berkas audio...";
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const totalDuration = audioBuffer.duration; // dalam detik
        const sampleRate = audioBuffer.sampleRate;
        const numChannels = audioBuffer.numberOfChannels;

        // Targetkan ~20MB per segmen WAV (PCM 16-bit). Estimasi: sampleRate * channels * 2 byte * durasi
        const bytesPerSecond = sampleRate * numChannels * 2;
        const targetBytesPerSegment = 20 * 1024 * 1024;
        const segmentDurationSec = Math.max(
          60,
          Math.floor(targetBytesPerSegment / bytesPerSecond),
        );

        const numSegments = Math.ceil(totalDuration / segmentDurationSec);
        const segments = [];

        for (let i = 0; i < numSegments; i++) {
          statusTextEl.textContent = `Memotong audio: bagian ${i + 1} dari ${numSegments}...`;
          const startSec = i * segmentDurationSec;
          const endSec = Math.min(startSec + segmentDurationSec, totalDuration);
          const segmentBuffer = sliceAudioBuffer(
            audioBuffer,
            startSec,
            endSec,
            audioContext,
          );
          const wavBlob = audioBufferToWavBlob(segmentBuffer);
          segments.push(wavBlob);
        }

        return segments;
      }

      function sliceAudioBuffer(audioBuffer, startSec, endSec, audioContext) {
        const sampleRate = audioBuffer.sampleRate;
        const startSample = Math.floor(startSec * sampleRate);
        const endSample = Math.floor(endSec * sampleRate);
        const frameCount = endSample - startSample;
        const numChannels = audioBuffer.numberOfChannels;

        const newBuffer = audioContext.createBuffer(
          numChannels,
          frameCount,
          sampleRate,
        );
        for (let ch = 0; ch < numChannels; ch++) {
          const sourceData = audioBuffer.getChannelData(ch);
          const newData = newBuffer.getChannelData(ch);
          for (let i = 0; i < frameCount; i++) {
            newData[i] = sourceData[startSample + i];
          }
        }
        return newBuffer;
      }

      function audioBufferToWavBlob(audioBuffer) {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const numFrames = audioBuffer.length;
        const bytesPerSample = 2; // 16-bit PCM
        const blockAlign = numChannels * bytesPerSample;
        const dataSize = numFrames * blockAlign;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        function writeString(offset, str) {
          for (let i = 0; i < str.length; i++)
            view.setUint8(offset + i, str.charCodeAt(i));
        }

        writeString(0, "RIFF");
        view.setUint32(4, 36 + dataSize, true);
        writeString(8, "WAVE");
        writeString(12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, 16, true);
        writeString(36, "data");
        view.setUint32(40, dataSize, true);

        let offset = 44;
        const channelData = [];
        for (let ch = 0; ch < numChannels; ch++) {
          channelData.push(audioBuffer.getChannelData(ch));
        }
        for (let i = 0; i < numFrames; i++) {
          for (let ch = 0; ch < numChannels; ch++) {
            let sample = Math.max(-1, Math.min(1, channelData[ch][i]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
            view.setInt16(offset, sample, true);
            offset += 2;
          }
        }

        return new Blob([buffer], { type: "audio/wav" });
      }

      let currentAudioSource = "upload";
      let recordedAudioBlob = null;
      let systemMediaRecorder = null;
      let systemRecordedChunks = [];
      let systemMediaStream = null;

      function switchAudioSource(source) {
        currentAudioSource = source;
        const uploadTab = document.getElementById("src-tab-upload");
        const recordTab = document.getElementById("src-tab-record");
        const uploadPanel = document.getElementById("source-upload-panel");
        const recordPanel = document.getElementById("source-record-panel");

        if (source === "upload") {
          uploadTab.classList.add("active-source");
          recordTab.classList.remove("active-source");
          uploadPanel.style.display = "block";
          recordPanel.style.display = "none";
        } else {
          uploadTab.classList.remove("active-source");
          recordTab.classList.add("active-source");
          uploadPanel.style.display = "none";
          recordPanel.style.display = "block";
        }
      }

      async function startSystemRecording() {
        const statusEl = document.getElementById("system-record-status");
        const startBtn = document.getElementById("btn-start-system-record");
        const stopBtn = document.getElementById("btn-stop-system-record");

        try {
          statusEl.textContent =
            "Menunggu Anda memilih tab/jendela untuk dibagikan...";
          systemMediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: true, // sebagian browser mewajibkan video di permintaan, walau hanya audio yang kita pakai
            audio: true,
          });

          const audioTracks = systemMediaStream.getAudioTracks();
          if (audioTracks.length === 0) {
            systemMediaStream.getTracks().forEach((t) => t.stop());
            statusEl.textContent =
              'Tidak ada audio terdeteksi — pastikan "Share system audio" atau "Share tab audio" dicentang saat dialog muncul.';
            showToast(
              "Audio sistem tidak tertangkap. Coba lagi dan centang opsi share audio.",
            );
            return;
          }

          const audioOnlyStream = new MediaStream(audioTracks);
          systemRecordedChunks = [];
          systemMediaRecorder = new MediaRecorder(audioOnlyStream);

          systemMediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) systemRecordedChunks.push(e.data);
          };

          systemMediaRecorder.onstop = () => {
            const mimeType = systemMediaRecorder.mimeType || "audio/webm";
            recordedAudioBlob = new Blob(systemRecordedChunks, {
              type: mimeType,
            });
            const sizeMB = (recordedAudioBlob.size / 1024 / 1024).toFixed(2);
            statusEl.textContent = `Rekaman selesai · ${sizeMB} MB · siap dikirim untuk transkripsi`;
            systemMediaStream.getTracks().forEach((t) => t.stop());
          };

          // Jika pengguna menutup dialog share dari browser (bukan dari tombol kita), hentikan rekaman juga
          audioTracks[0].addEventListener("ended", () => {
            if (
              systemMediaRecorder &&
              systemMediaRecorder.state !== "inactive"
            ) {
              systemMediaRecorder.stop();
            }
          });

          systemMediaRecorder.start();
          statusEl.textContent =
            "Sedang merekam audio sistem... (biarkan tab ini tetap terbuka)";
          startBtn.disabled = true;
          stopBtn.disabled = false;
        } catch (err) {
          statusEl.textContent = "Gagal memulai rekaman: " + err.message;
          showToast(
            "Gagal mengakses audio sistem — browser mungkin tidak mendukung atau izin ditolak.",
          );
          console.error("Error saat memulai rekaman sistem:", err);
        }
      }

      function stopSystemRecording() {
        const startBtn = document.getElementById("btn-start-system-record");
        const stopBtn = document.getElementById("btn-stop-system-record");

        if (systemMediaRecorder && systemMediaRecorder.state !== "inactive") {
          systemMediaRecorder.stop();
        }
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }

      async function toggleRec() {
        if (recOn) return; // proses sedang berjalan, tombol nonaktif secara logika

        let file = null;
        if (currentAudioSource === "upload") {
          const fileInput = document.getElementById("audio-file-input");
          file = fileInput.files[0];
        } else {
          file = recordedAudioBlob;
        }

        if (!openaiApiKey) {
          showToast("Isi dan simpan API key OpenAI terlebih dahulu");
          return;
        }
        if (!file) {
          showToast(
            currentAudioSource === "upload"
              ? "Pilih berkas audio rapat terlebih dahulu"
              : "Belum ada hasil rekaman. Mulai dan hentikan rekaman terlebih dahulu.",
          );
          return;
        }

        recOn = true;
        recSec = 0;
        const btn = document.getElementById("rec-btn");
        const icon = document.getElementById("rec-icon");
        const pulse = document.getElementById("rec-pulse");
        const hint = document.getElementById("rec-hint");
        const sub = document.getElementById("rec-sub");
        const stxt = document.getElementById("humas-status-text");
        const dot = document.getElementById("humas-live-dot");
        const statusBox = document.getElementById("rec-status-box");
        const statusText = document.getElementById("rec-status-text");
        const bars = document.querySelectorAll(".wbar2");

        btn.className = "rec-btn recording";
        icon.className = "ti ti-loader-2";
        pulse.classList.add("on");
        hint.textContent = "Memproses audio...";
        sub.textContent = "Mohon tunggu, sedang memproses";
        stxt.textContent = "Memproses";
        dot.style.animation = "liveBlink 1s ease-in-out infinite";
        dot.style.background = "var(--danger)";
        bars.forEach((b) => b.classList.add("on"));
        statusBox.style.display = "flex";
        statusBox.style.background = "";
        statusBox.style.color = "";
        statusText.textContent =
          "Langkah 1/2: Mengirim audio ke Whisper untuk transkripsi...";

        recInt = setInterval(() => {
          recSec++;
          const h = Math.floor(recSec / 3600),
            m = Math.floor((recSec % 3600) / 60),
            s = recSec % 60;
          document.getElementById("humas-timer").textContent =
            String(h).padStart(2, "0") +
            ":" +
            String(m).padStart(2, "0") +
            ":" +
            String(s).padStart(2, "0");
        }, 1000);

        try {
          // LANGKAH 1: Whisper API — audio menjadi transkrip teks
          // File besar (>24MB) otomatis dipecah menjadi beberapa segmen sebelum dikirim
          const MAX_SIZE_BYTES = 24 * 1024 * 1024;
          let transcript = "";

          if (file.size <= MAX_SIZE_BYTES) {
            statusText.textContent =
              "Langkah 1/2: Mengirim audio ke Whisper untuk transkripsi...";
            transcript = await transcribeSingleFile(file, openaiApiKey);
          } else {
            statusText.textContent =
              "Berkas besar terdeteksi, memecah audio menjadi beberapa bagian...";
            const segments = await splitAudioFile(file, statusText);

            let combinedTranscript = [];
            for (let i = 0; i < segments.length; i++) {
              statusText.textContent = `Langkah 1/2: Mentranskripsi bagian ${i + 1} dari ${segments.length}...`;
              const segmentText = await transcribeSingleFile(
                segments[i],
                openaiApiKey,
              );
              combinedTranscript.push(segmentText);
            }
            transcript = combinedTranscript.join(" ");
          }

          if (!transcript) {
            throw new Error(
              "Whisper API tidak mengembalikan transkrip apa pun.",
            );
          }

          // Transkrip mentah disimpan untuk dikoreksi oleh Bagian Umum sebelum diringkas
          rawTranscriptPending = transcript;
          renderTranskripUntukKoreksi(transcript);

          statusText.textContent =
            "Transkrip selesai dibuat, menunggu koreksi Bagian Umum";
          hint.textContent = "Transkripsi selesai";
          sub.textContent =
            "Buka halaman Koreksi Transkrip untuk diperiksa Bagian Umum";
          stxt.textContent = "Selesai transkripsi";
          dot.style.animation = "none";
          dot.style.background = "var(--success)";
          showToast(
            "Transkrip selesai · Buka halaman Koreksi Transkrip untuk dikoreksi Bagian Umum",
          );
          const kc = document.getElementById("koreksi-count");
          if (kc) kc.style.display = "inline-flex";
        } catch (err) {
          statusText.textContent = "Gagal: " + err.message;
          statusBox.style.background = "var(--danger-bg)";
          statusBox.style.color = "var(--danger-text)";
          hint.textContent = "Terjadi kesalahan";
          sub.textContent =
            "Cek console browser (F12) untuk detail error lengkap";
          stxt.textContent = "Gagal";
          showToast("Gagal memproses audio — lihat detail di kartu status");
          console.error("Error saat memproses audio:", err);
        } finally {
          btn.className = "rec-btn idle";
          icon.className = "ti ti-send";
          pulse.classList.remove("on");
          bars.forEach((b) => b.classList.remove("on"));
          clearInterval(recInt);
          recOn = false;
        }
      }

      function renderTranskripUntukKoreksi(transcript) {
        const textarea = document.getElementById("koreksi-transkrip");
        const badge = document.getElementById("koreksi-status-badge");
        const wordCount = document.getElementById("koreksi-word-count");
        const lanjutBtn = document.getElementById("btn-lanjut-ringkasan");

        if (textarea) textarea.value = transcript;
        if (badge) {
          badge.className = "badge badge-warning";
          badge.textContent = "Menunggu koreksi";
        }
        if (wordCount)
          wordCount.textContent =
            "· " + transcript.trim().split(/\s+/).length + " kata";
        if (lanjutBtn) lanjutBtn.disabled = false;
      }

      function downloadNotulenPDF() {
        if (!lastNotulenResult || !lastNotulenResult.markdown) {
          showToast(
            "Belum ada notulen untuk diunduh. Selesaikan proses ringkasan terlebih dahulu.",
          );
          return;
        }

        const judul =
          document.getElementById("meta-judul").value.trim() ||
          "(Judul rapat belum diisi)";
        const ruangan =
          document.getElementById("meta-ruangan").value.trim() || "-";
        const tanggal = document.getElementById("meta-tanggal").value || "-";
        const jamMulai = document.getElementById("meta-jam-mulai").value || "-";
        const jamSelesai =
          document.getElementById("meta-jam-selesai").value || "-";
        const pesertaRaw = document.getElementById("meta-peserta").value.trim();
        const pesertaList = pesertaRaw
          ? pesertaRaw
              .split("\n")
              .map((p) => p.trim())
              .filter((p) => p)
          : [];

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const marginLeft = 18;
        const marginRight = 18;
        const pageWidth = doc.internal.pageSize.getWidth();
        const usableWidth = pageWidth - marginLeft - marginRight;

        const state = {
          doc,
          marginLeft,
          marginRight,
          pageWidth,
          usableWidth,
          y: 20,
        };
        state.checkPageBreak = function (extraHeight) {
          const pageHeight = doc.internal.pageSize.getHeight();
          if (state.y + extraHeight > pageHeight - 18) {
            doc.addPage();
            state.y = 20;
          }
        };
        const checkPageBreak = state.checkPageBreak;

        // Judul dokumen
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text("NOTULEN RAPAT", marginLeft, state.y);
        state.y += 9;

        doc.setFontSize(12);
        const judulLines = doc.splitTextToSize(judul, usableWidth);
        doc.text(judulLines, marginLeft, state.y);
        state.y += judulLines.length * 6 + 4;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        [
          `Tanggal: ${tanggal}`,
          `Waktu: ${jamMulai} - ${jamSelesai}`,
          `Ruangan: ${ruangan}`,
        ].forEach((line) => {
          doc.text(line, marginLeft, state.y);
          state.y += 5.5;
        });

        if (pesertaList.length > 0) {
          state.y += 2;
          doc.setFont("helvetica", "bold");
          doc.text("Peserta hadir:", marginLeft, state.y);
          state.y += 5.5;
          doc.setFont("helvetica", "normal");
          const pesertaWrapped = doc.splitTextToSize(
            pesertaList.join(", "),
            usableWidth,
          );
          checkPageBreak(pesertaWrapped.length * 5);
          doc.text(pesertaWrapped, marginLeft, state.y);
          state.y += pesertaWrapped.length * 5;
        }

        state.y += 4;
        doc.setDrawColor(200);
        doc.line(marginLeft, state.y, pageWidth - marginRight, state.y);
        state.y += 8;

        // Parsing dan render isi notulen (Markdown) ke elemen PDF asli
        renderMarkdownToPDF(lastNotulenResult.markdown, state);

        // Footer pada setiap halaman
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Dihasilkan oleh sistem eNotulen · ${new Date().toLocaleString("id-ID")} · Halaman ${i} dari ${pageCount}`,
            marginLeft,
            doc.internal.pageSize.getHeight() - 10,
          );
          doc.setTextColor(0);
        }

        const safeFileName =
          judul
            .replace(/[^a-z0-9]+/gi, "-")
            .toLowerCase()
            .slice(0, 60) || "notulen-rapat";
        doc.save(`${safeFileName}.pdf`);
        showToast("Notulen berhasil diunduh sebagai PDF");
      }

      function renderMarkdownToPDF(markdownText, state) {
        const { doc, marginLeft, usableWidth, checkPageBreak } = state;
        const lines = markdownText.split("\n");
        let i = 0;

        function setY(val) {
          state.y = val;
        }
        function getY() {
          return state.y;
        }

        while (i < lines.length) {
          const line = lines[i];
          const trimmed = line.trim();

          if (!trimmed) {
            i++;
            continue;
          }

          // Heading level 1-3
          const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
          if (headingMatch) {
            const level = headingMatch[1].length;
            const text = stripInlineMarkdown(headingMatch[2]);
            const fontSize = level === 1 ? 13 : level === 2 ? 11.5 : 10.5;
            checkPageBreak(10);
            setY(getY() + (level === 2 ? 3 : 2));
            doc.setFont("helvetica", "bold");
            doc.setFontSize(fontSize);
            const wrapped = doc.splitTextToSize(text, usableWidth);
            checkPageBreak(wrapped.length * 5.5);
            doc.text(wrapped, marginLeft, getY());
            setY(getY() + wrapped.length * 5.5 + 2);
            i++;
            continue;
          }

          // Tabel Markdown: baris dimulai dan diakhiri dengan |
          if (trimmed.startsWith("|")) {
            const tableLines = [];
            while (i < lines.length && lines[i].trim().startsWith("|")) {
              tableLines.push(lines[i].trim());
              i++;
            }
            // Baris kedua biasanya separator (---), buang jika terdeteksi
            const dataRows = tableLines.filter(
              (r) => !/^\|[\s\-:|]+\|$/.test(r),
            );
            const rows = dataRows.map((r) =>
              r
                .split("|")
                .slice(1, -1)
                .map((c) => stripInlineMarkdown(c.trim())),
            );
            if (rows.length > 0) {
              renderTablePDF(rows, state);
            }
            continue;
          }

          // Numbered list: "1. teks"
          const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numberedMatch) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const text = stripInlineMarkdown(numberedMatch[2]);
            const prefix = `${numberedMatch[1]}. `;
            const wrapped = doc.splitTextToSize(text, usableWidth - 6);
            checkPageBreak(wrapped.length * 5 + 1.5);
            doc.text(prefix, marginLeft, getY());
            doc.text(wrapped, marginLeft + 6, getY());
            setY(getY() + wrapped.length * 5 + 1.5);
            i++;
            continue;
          }

          // Bullet list: "- teks" atau "* teks"
          const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
          if (bulletMatch) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const text = stripInlineMarkdown(bulletMatch[1]);
            const wrapped = doc.splitTextToSize(text, usableWidth - 6);
            checkPageBreak(wrapped.length * 5 + 1.5);
            doc.text("\u2022", marginLeft, getY());
            doc.text(wrapped, marginLeft + 6, getY());
            setY(getY() + wrapped.length * 5 + 1.5);
            i++;
            continue;
          }

          // Paragraf biasa
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const text = stripInlineMarkdown(trimmed);
          const wrapped = doc.splitTextToSize(text, usableWidth);
          checkPageBreak(wrapped.length * 5 + 3);
          doc.text(wrapped, marginLeft, getY());
          setY(getY() + wrapped.length * 5 + 3);
          i++;
        }
      }

      function renderTablePDF(rows, state) {
        const { doc, marginLeft, usableWidth, checkPageBreak } = state;
        if (rows.length === 0) return;

        const numCols = rows[0].length;
        const colWidth = usableWidth / numCols;
        const cellPadding = 2;
        const fontSize = 9;

        doc.setFontSize(fontSize);

        rows.forEach((row, rowIndex) => {
          const isHeader = rowIndex === 0;
          doc.setFont("helvetica", isHeader ? "bold" : "normal");

          const wrappedCells = row.map((cell) =>
            doc.splitTextToSize(cell, colWidth - cellPadding * 2),
          );
          const rowHeight =
            Math.max(...wrappedCells.map((c) => c.length)) * 4.2 +
            cellPadding * 2;

          checkPageBreak(rowHeight);
          const rowStartY = state.y;

          row.forEach((cell, colIndex) => {
            const x = marginLeft + colIndex * colWidth;
            doc.rect(x, rowStartY, colWidth, rowHeight);
            doc.text(
              wrappedCells[colIndex],
              x + cellPadding,
              rowStartY + cellPadding + 3.2,
            );
          });

          state.y = rowStartY + rowHeight;
        });

        state.y += 4;
      }

      function stripInlineMarkdown(text) {
        return text
          .replace(/\*\*(.+?)\*\*/g, "$1")
          .replace(/\*(.+?)\*/g, "$1")
          .replace(/`(.+?)`/g, "$1")
          .trim();
      }

      function downloadTranskrip() {
        const textarea = document.getElementById("koreksi-transkrip");
        const text = textarea.value.trim();
        if (!text) {
          showToast("Belum ada transkrip untuk disimpan");
          return;
        }
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[:T]/g, "-");
        a.href = url;
        a.download = `transkrip-rapat-${timestamp}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Transkrip disimpan sebagai file .txt");
      }

      function uploadTranskrip(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          const text = e.target.result;
          renderTranskripUntukKoreksi(text);
          showToast("Transkrip dimuat dari file: " + file.name);
        };
        reader.onerror = function () {
          showToast("Gagal membaca file .txt");
        };
        reader.readAsText(file, "UTF-8");

        event.target.value = ""; // reset input agar bisa upload file yang sama lagi jika perlu
      }

      function onKoreksiTranskripChanged() {
        const textarea = document.getElementById("koreksi-transkrip");
        const wordCount = document.getElementById("koreksi-word-count");
        const lanjutBtn = document.getElementById("btn-lanjut-ringkasan");
        const text = textarea.value.trim();

        if (wordCount)
          wordCount.textContent = text
            ? "· " + text.split(/\s+/).length + " kata"
            : "";
        if (lanjutBtn) lanjutBtn.disabled = !text;
      }

      async function doLanjutkanRingkasan() {
        if (!openaiApiKey) {
          showToast(
            "API key OpenAI belum tersimpan. Isi di halaman Operator Rekaman.",
          );
          return;
        }
        const textarea = document.getElementById("koreksi-transkrip");
        const correctedTranscript = textarea.value.trim();
        if (!correctedTranscript) {
          showToast("Transkrip masih kosong, tidak ada yang bisa diringkas.");
          return;
        }

        const lanjutBtn = document.getElementById("btn-lanjut-ringkasan");
        const badge = document.getElementById("koreksi-status-badge");
        lanjutBtn.disabled = true;
        lanjutBtn.innerHTML =
          '<i class="ti ti-loader-2"></i> Meminta ringkasan GPT...';
        badge.className = "badge badge-info";
        badge.textContent = "Sedang diringkas...";

        try {
          const promptText = `Berikut adalah transkrip audio rapat (telah dikoreksi oleh Bagian Umum):

${correctedTranscript}

Buatkan notulen rapat dalam Bahasa Indonesia dalam format MARKDOWN, mengikuti gaya berikut (seperti contoh resume rapat profesional):

1. Susun notulen berdasarkan TOPIK/AGENDA yang benar-benar dibahas dalam transkrip. Tentukan sendiri topik-topik tersebut dari isi pembicaraan, jangan memaksakan struktur tertentu jika tidak relevan. Setiap topik diberi heading level 2 (##), bernomor urut.

2. Untuk setiap topik, tulis dalam bentuk PARAGRAF NARATIF yang menjelaskan apa yang dipaparkan, pertanyaan/tanggapan dari peserta, dan jawaban yang diberikan. JIKA seseorang disebutkan namanya secara eksplisit dalam transkrip, kaitkan pernyataan dengan nama tersebut (contoh: "Bapak Budi menjelaskan bahwa..."). Jika tidak ada nama disebutkan, gunakan sebutan netral seperti "salah satu peserta" atau "pimpinan rapat" — JANGAN MENGARANG nama.

3. JIKA dalam suatu topik terdapat data yang sifatnya tabular (misalnya: daftar dengan beberapa atribut, perbandingan angka/jadwal/anggaran per item), sajikan dalam bentuk TABEL MARKDOWN. Jika ada poin-poin penting yang lebih cocok berupa daftar (misalnya beberapa hal yang ditekankan atau dicatat), gunakan BULLET LIST. Gunakan tabel/list HANYA jika memang sesuai, jangan dipaksakan di setiap topik.

4. Di BAGIAN AKHIR, buat heading "## Keputusan dan Tindak Lanjut" berisi NUMBERED LIST dari semua keputusan konkret dan tugas/tindak lanjut yang disebutkan dalam rapat, sertakan PIC (penanggung jawab) dan deadline jika disebutkan dalam transkrip.

5. JANGAN mengarang informasi yang tidak ada dalam transkrip. Jika suatu bagian tidak memiliki informasi, lewati saja bagian tersebut.

Tulis HANYA notulen dalam format Markdown tersebut, tanpa kalimat pembuka/penutup tambahan seperti "Berikut adalah notulen rapat:".`;

          const gptResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + openaiApiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: promptText }],
                max_tokens: 4096,
              }),
            },
          );

          if (!gptResponse.ok) {
            const errBody = await gptResponse.text();
            throw new Error(
              "GPT API gagal (status " + gptResponse.status + "): " + errBody,
            );
          }

          const gptResult = await gptResponse.json();
          const markdownText = gptResult.choices[0].message.content.trim();

          lastNotulenResult = {
            markdown: markdownText,
            _transkrip_terkoreksi: correctedTranscript,
          };

          badge.className = "badge badge-success";
          badge.textContent = "Selesai diringkas";
          const kc = document.getElementById("koreksi-count");
          if (kc) kc.style.display = "none";

          showToast(
            "Notulen draft selesai dibuat dari transkrip yang sudah dikoreksi",
          );
          renderNotulenResult(lastNotulenResult);
        } catch (err) {
          badge.className = "badge badge-danger";
          badge.textContent = "Gagal meringkas";
          showToast("Gagal meminta ringkasan dari GPT: " + err.message);
          console.error("Error saat meminta ringkasan GPT:", err);
        } finally {
          lanjutBtn.disabled = false;
          lanjutBtn.innerHTML =
            '<i class="ti ti-arrow-right"></i> Lanjutkan ke ringkasan';
        }
      }

      function renderNotulenResult(result) {
        document.getElementById("notulen-meta-info").innerHTML =
          "Draft dihasilkan oleh Whisper (transkripsi) dan GPT-4o-mini (notulen) · Diterima " +
          new Date().toLocaleTimeString("id-ID");

        const rawTextarea = document.getElementById("notulen-markdown-raw");
        if (rawTextarea)
          rawTextarea.value = result.markdown || "(Tidak ada hasil notulen)";
        renderNotulenMarkdown();

        // Sesuai model peran: validasi/koreksi dilakukan oleh Bag. Umum/PIC rapat di tahap sebelumnya.
        // Pimpinan mengakses notulen final secara read-only setelah dipublikasikan, tanpa gerbang approval terpisah.
        const publishBtn = document.getElementById("btn-publish");
        if (publishBtn) publishBtn.disabled = false;

        showPage("notulen");
      }

      function renderNotulenMarkdown() {
        const rawTextarea = document.getElementById("notulen-markdown-raw");
        const renderedView = document.getElementById("notulen-rendered-view");
        if (!rawTextarea || !renderedView) return;

        const markdownText = rawTextarea.value;
        if (lastNotulenResult) lastNotulenResult.markdown = markdownText;

        renderedView.innerHTML = markdownText
          ? marked.parse(markdownText)
          : '<p style="font-size:12px;color:var(--text-3)">— Belum ada notulen —</p>';
      }

      function toggleEditNotulen() {
        const renderedView = document.getElementById("notulen-rendered-view");
        const rawTextarea = document.getElementById("notulen-markdown-raw");
        const toggleBtn = document.getElementById("btn-toggle-edit-notulen");
        const isEditing = rawTextarea.style.display !== "none";

        if (isEditing) {
          renderNotulenMarkdown();
          renderedView.style.display = "block";
          rawTextarea.style.display = "none";
          toggleBtn.innerHTML = '<i class="ti ti-edit"></i> Edit';
        } else {
          renderedView.style.display = "none";
          rawTextarea.style.display = "block";
          toggleBtn.innerHTML = '<i class="ti ti-eye"></i> Lihat hasil';
        }
      }

      function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
      }

      function doTandai() {
        if (!recOn) return;
        tandaiN++;
        const t = document.getElementById("humas-timer").textContent;
        const list = document.getElementById("tandai-list");
        const item = document.createElement("div");
        item.className = "tandai-item";
        item.innerHTML = `<i class="ti ti-bookmark"></i><span>Poin ${tandaiN} ditandai</span><span class="tandai-time">${t}</span>`;
        list.appendChild(item);
      }

      function overrideAbs(sel) {
        if (!sel.value || sel.value === "—") return;
        const row = sel.closest("tr");
        const statusCell = row.cells[5];
        const map = {
          Hadir: "badge-success",
          Terlambat: "badge-warning",
          Izin: "badge-info",
          Alpha: "badge-danger",
        };
        statusCell.innerHTML = `<span class="badge ${map[sel.value]}">${sel.value}</span>`;
        sel.value = "—";
        showToast("Status absensi diperbarui");
      }

      function filterAbs(f) {
        showToast("Filter: " + (f === "all" ? "Semua" : f));
      }

      function showToast(msg) {
        const t = document.getElementById("toast");
        document.getElementById("toast-msg").textContent = msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 2800);
      }
