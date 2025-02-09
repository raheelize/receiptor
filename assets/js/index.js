$(document).ready(function() {
    $('#senderForm').on('submit', async function(event) {
        event.preventDefault();

        // Get form values
        const senderName = $('#senderName').val().trim();
        const senderAddress = $('#senderAddress').val().trim();
        const senderCity = $('#senderCity').val().trim();
        const senderPhone = $('#senderPhone').val().trim();
        const fileInput = $('#excelFile')[0].files[0];

        // Validation for empty fields
        if (!senderName || !senderAddress || !senderCity || !senderPhone || !fileInput) {
            alert("Please fill out all fields and upload an Excel file.");
            return;
        }

        // Name validation (no special characters allowed)
        const namePattern = /^[A-Za-z0-9\s]+$/;  // Only letters, numbers, and spaces
        if (!namePattern.test(senderName)) {
            alert("Name cannot contain special characters.");
            return;
        }

        // Address validation (no special characters allowed)
        const addressPattern = /^[A-Za-z0-9\s,.-]+$/;  // Allows letters, numbers, spaces, commas, periods, and hyphens
        if (!addressPattern.test(senderAddress)) {
            alert("Address cannot contain special characters.");
            return;
        }

        // Phone number validation (must match the format 03XX-XXXXXXX)
        const phonePattern = /^03\d{2}-\d{7}$/; // Validates phone number format like 03XX-XXXXXXX
        if (!phonePattern.test(senderPhone)) {
            alert("Phone number must match the format 03XX-XXXXXXX.");
            return;
        }

        // Check for file type (Excel)
        if (!fileInput.name.endsWith('.xlsx') && !fileInput.name.endsWith('.xls')) {
            alert("Please upload a valid Excel file (.xlsx or .xls).");
            return;
        }

        try {
            const data = await fileInput.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(worksheet);

            if (rows.length === 0) {
                alert("The Excel file is empty or not in the required format.");
                return;
            }

            const receiptContainer = $('#receiptContainer');
            receiptContainer.removeClass('d-none');

            const mainContainer = $('#main');
            mainContainer.addClass('d-none');

            const tableWrapper = $('#tableWrapper');
            tableWrapper.empty(); // Clear previous content

            rows.forEach(row => {
                const cardHTML = createReceiptCard(row, senderName, senderAddress, senderCity, senderPhone);
                tableWrapper.append(cardHTML);
            });
        } catch (error) {
            console.error("Error generating receipts:", error);
            alert("An error occurred while generating the receipts. Please check the console for more details.");
        }
    });
});

function createReceiptCard(row, senderName, senderAddress, senderCity, senderPhone) {
    // Sender information from the input form
    const senderInfo = `
        <tr><th class="bg-light">Name</th><td>${senderName}</td></tr>
        <tr><th class="bg-light">Address</th><td>${senderAddress}</td></tr>
        <tr><th class="bg-light">City</th><td>${senderCity}</td></tr>
        <tr><th class="bg-light">Phone number</th><td>${senderPhone}</td></tr>
    `;

    // Dynamically generate receiver information based on row data
    let receiverInfo = "";
    for (const [key, value] of Object.entries(row)) {
        receiverInfo += `<tr><th class="bg-light">${key}</th><td>${value || ''}</td></tr>`;
    }

    return `
        <div class="col-md-12 col-lg-12 mb-4">
            <div class="card shadow-sm">
                <div class="card-header bg-default "><b>From: </b>(Bulk User 53 GPO Sahiwal)</div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th colspan="2" class="text-center bg-light text-dark">From Information</th>
                                <th colspan="2" class="text-center bg-light text-dark">To Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="2">
                                    <table class="table table-bordered">
                                        ${senderInfo}
                                    </table>
                                </td>
                                <td colspan="2">
                                    <table class="table table-bordered">
                                        ${receiverInfo}
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
