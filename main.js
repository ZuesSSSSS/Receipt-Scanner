
// document.write('JS file loaded')
const suppliedImage = './GasReceiptSimple.jpg'
function returnWords(data) {
	words = []
	for (i in data.words) {
		words.push(data.words[i].text)
	}
	return words
}
function returnConfidence(data) {
	confidence = []
	for (i in data.words) {
		confidence.push(data.words[i].confidence)
	}
	return confidence
}
function getGasLocation(data) {
	gasStationLocation = ""
	beginningIndex = (data.indexOf("WELCOME")) + 2
	endIndex = data.indexOf("DATE")

	for (let i = beginningIndex; i < endIndex; i++) {
		gasStationLocation += ` ${data[i]}`
	}
	return gasStationLocation.trim()
}
function dataSort(data) {
	receiptArray = returnWords(data)
	ocrConfidence = returnConfidence(data)

	dateIndex = (receiptArray.indexOf("DATE")) + 1
	timeIndex = (receiptArray.indexOf("DATE")) + 2
	transactionIndex = (receiptArray.indexOf("TRAN#")) + 1
	pumpIndex = (receiptArray.indexOf("PUMP#")) + 1
	productTypeIndex = (receiptArray.indexOf("PRODUCT:")) + 1
	totalGallonsIndex = (receiptArray.indexOf("GALLONS:")) + 1
	pricePerGallonIndex = (receiptArray.indexOf("PRICE/G:")) + 1
	totalIndex = (receiptArray.indexOf("SALE")) + 1
	totalCreditIndex = (receiptArray.indexOf("CREDIT")) + 1
	vehicleIdIndex = (receiptArray.indexOf("Vehicle")) + 1
	transactionIdIndex = (receiptArray.indexOf("Trans")) + 2

	receipt = {
						'Location': [getGasLocation(receiptArray)],
						'Date': [receiptArray[dateIndex],
											ocrConfidence[dateIndex]],
						'Time': [receiptArray[timeIndex],
											ocrConfidence[timeIndex]],
						'Transaction': [receiptArray[transactionIndex],
														ocrConfidence[transactionIndex]],
						'Pump': [receiptArray[pumpIndex],
											ocrConfidence[pumpIndex]],
						'ProductType': [receiptArray[productTypeIndex],
															ocrConfidence[productTypeIndex]],
						'Gallons': [receiptArray[totalGallonsIndex],
													ocrConfidence[totalGallonsIndex]],
						"PricePerGallon": [receiptArray[pricePerGallonIndex],
																ocrConfidence[pricePerGallonIndex]],
						"Total": [receiptArray[totalIndex],
												ocrConfidence[totalIndex]],
						"TotalCredit": [receiptArray[totalCreditIndex],
															ocrConfidence[totalCreditIndex]],
						"VehicleId": [receiptArray[vehicleIdIndex],
														ocrConfidence[vehicleIdIndex]],
						"TransId": [receiptArray[transactionIdIndex],
													ocrConfidence[transactionIdIndex]]
					}

	return receipt
}
function main(file) {
	const worker = Tesseract.createWorker({
		logger: m => console.log(m.progress)
	})
	Tesseract.setLogging(false)
	main()

	async function main() {
		await worker.load()
		await worker.loadLanguage('eng')
		await worker.initialize('eng')


		let result = await
		worker.detect(file)
		// console.log(result.data)

		result = await
		worker.recognize(file)
		receipt = dataSort(result.data)
		// console.log(result.data)
		// console.log(receipt)
		document.getElementById('location').text += `${receipt.Location[0]}`
		document.getElementById('date').text += `${receipt.Date[0]} [${(Math.round(receipt.Date[1]))/100}]`
		document.getElementById('time').text += `${receipt.Time[0]} [${(Math.round(receipt.Time[1]))/100}]`
		document.getElementById('transaction').text += `${receipt.Transaction[0]} [${(Math.round(receipt.Transaction[1]))/100}]`
		document.getElementById('pump').text += `${receipt.Pump[0]} [${(Math.round(receipt.Pump[1]))/100}]`
		document.getElementById('productType').text += `${receipt.ProductType[0]} [${(Math.round(receipt.ProductType[1]))/100}]`
		document.getElementById('gallons').text += `${receipt.Gallons[0]} [${(Math.round(receipt.Gallons[1]))/100}]`
		document.getElementById('pricePerGallon').text += `${receipt.PricePerGallon[0]} [${(Math.round(receipt.PricePerGallon[1]))/100}]`
		document.getElementById('total').text += `${receipt.Total[0]} [${(Math.round(receipt.Total[1]))/100}]`
		document.getElementById('totalCredit').text += `${receipt.TotalCredit[0]} [${(Math.round(receipt.TotalCredit[1]))/100}]`
		document.getElementById('vehicleid').text += `${receipt.VehicleId[0]} [${(Math.round(receipt.VehicleId[1]))/100}]`
		document.getElementById('transId').text += `${receipt.TransId[0]} [${(Math.round(receipt.TransId[1]))/100}]`
		await worker.terminate()
	}
}
imageUpload = document.getElementById('receiptUpload')
imageUpload.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const imageUpload = reader.result;
    main(imageUpload)
  });
  reader.readAsDataURL(this.files[0]);
});
