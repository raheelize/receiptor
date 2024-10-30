document.getElementById("generateReceipts").addEventListener("click", async () => {
    const fileInput = document.getElementById("excelFile").files[0];
    if (!fileInput) {
        alert("Please upload an Excel file.");
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

        const receiptContainer = document.getElementById("receiptContainer");
        receiptContainer.classList.remove("d-none");

        const mainContainer = document.getElementById("main");
        mainContainer.classList.add("d-none");

        const tableWrapper = document.getElementById("tableWrapper");
        tableWrapper.innerHTML = ""; // Clear previous content

        rows.forEach(row => {
            const cardHTML = createReceiptCard(row);
            tableWrapper.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error("Error generating receipts:", error);
        alert("An error occurred while generating the receipts. Please check the console for more details.");
    }
});

function createReceiptCard(row) {
    // Fixed sender information
    const senderInfo = `
        <tr><th class="bg-light">Name</th><td>Enfinity Store</td></tr>
        <tr><th class="bg-light">Address</th><td>B & R Colony Railway Road Sahiwal</td></tr>
        <tr><th class="bg-light">City</th><td>Sahiwal</td></tr>
        <tr><th class="bg-light">Phone number</th><td>0323-5419179</td></tr>
    `;

    // Dynamically generate receiver information based on row data
    let receiverInfo = "";
    for (const [key, value] of Object.entries(row)) {
        receiverInfo += `<tr><th class="bg-light">${key}</th><td>${value || ''}</td></tr>`;
    }

    return `
        <div class="col-md-12 col-lg-12 mb-4">
            <div class="card shadow-sm">
                <div class="card-header bg-default "><b>Sender: </b>(Bulk User 53 GPO Sahiwal)</div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th colspan="2" class="text-center bg-light text-dark">Sender Information</th>
                                <th colspan="2" class="text-center bg-light text-dark">Receiver Information</th>
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