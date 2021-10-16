import wixData from 'wix-data';
import {sendEmail} from 'backend/sendEmail.js';

// returns an array of emails like ["joshbell9181@gmail.com"]
async function getEmailList(){
    return await wixData.query("multiStepJobApplication")
					.find()
					.then( (results) => {
						let emailList = []
						results.items.forEach(element => {
							emailList.push(element.email)
						})
						return emailList
					})
}

// interval can be one of the following daily, weekly, monthly
async function getCurrentIndex(interval){
    return await wixData.query("index_counter")
					.find()
					.then( (results) => {
						return results.items[0][interval + 'indexid']
					})
}

// interval can be one of the following daily, weekly, monthly
async function getCurrentIndexRecord(interval){
    return await wixData.query("index_counter")
					.find()
					.then( (results) => {
						return results.items[0]
					})
}

// interval can be one of the following daily, weekly, mounthly
async function updateIndex(interval){

	let currentIndex = await getCurrentIndexRecord(interval);
	let maxIndex = await wixData.query(interval + "_suggestions")
					.descending("id")
					.find()
					.then( (results) => {
						return results.items[0]
					});
	let minIndex = await wixData.query(interval + "_suggestions")
					.ascending("id")
					.find()
					.then( (results) => {
						return results.items[0]
					});

	let setIndex = currentIndex[interval + 'indexid'] < maxIndex['id'] ? currentIndex[interval + 'indexid'] + 1 : minIndex['id'];

	// update index to new value
	let toUpdate = currentIndex;
	toUpdate[interval+ 'indexid'] = setIndex;
	console.log(toUpdate)
	await wixData.update("index_counter",toUpdate).then(results => {
		// pass intentionally
	})
}

async function getContent(interval, index) {
	let content = await wixData.query(interval + "_suggestions")
					.eq("id", index)
					.find()
					.then( (results) => {
						return results.items[0]["message"]
					});
	return content;
}

export async function dailyReminderJob(){
	const interval = 'daily';
	let emailList = await getEmailList();
	let index = await getCurrentIndex(interval);
	let content = await getContent(interval, index)
	emailList.forEach( email => {sendEmail(email,content)})
	let update = await updateIndex(interval);
}

export async function weeklyReminderJob(){
	const interval = 'weekly';
	let emailList = await getEmailList();
	let index = await getCurrentIndex(interval);
	let content = await getContent(interval, index)
	emailList.forEach( email => {sendEmail(email,content)})
	let update = await updateIndex(interval);
}

export async function monthlyReminderJob(){
	const interval = 'monthly';
	let emailList = await getEmailList();
	let index = await getCurrentIndex(interval);
	let content = await getContent(interval, index)
	emailList.forEach( email => {sendEmail(email,content)})
	let update = await updateIndex(interval);
}
