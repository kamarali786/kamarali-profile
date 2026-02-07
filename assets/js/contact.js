(function () {
    const formEl = document.getElementById("contactForm");
    if (!formEl) return;

    const submitBtn = formEl.querySelector("button[type='submit']");

    formEl.addEventListener("submit", async function (e) {
        e.preventDefault();

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = "Sending...";
        submitBtn.disabled = true;

        try {
            await emailjs.send(
                "service_4drocoa",
                "template_tncnn79",
                {
                    from_name: document.getElementById("name").value,
                    reply_to: document.getElementById("email").value,
                    subject: document.getElementById("company").value || "Portfolio Contact",
                    message: document.getElementById("message").value
                }
            );

            alert("✅ Message sent successfully!");
            formEl.reset();

        } catch (error) {
            alert("❌ Failed to send message");
            console.error(error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
})();
