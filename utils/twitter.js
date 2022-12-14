const { default: axios } = require('axios')
const http = require('http')
const needle = require('needle')
const config = require('dotenv').config()
const TOKEN = process.env.TWITTER_BEARER_TOEKN

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const streamURL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id'

// Rule: Get tweets that have keyword events
const rules = [{ value: 'events' }]

// Rule: Get stream rules
async function getRules() {
    const response = await needle('get', rulesURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    })

    return response.body
}

// Rule: Set Stream Rules
async function setRules() {
    const data = {
        add: rules
    }
    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    })

    return response.body
}


// Rule: Delete Stream rules
async function deleteRules() {
    if (!Array.isArray(rules.data)) {
        return null
    }

    const ids = rules.data.map((rule)=> rule.id)

    const data = {
        delete: {
            ids: ids,
        },
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    })

    return response.body
}

// Stream tweets

function streamTweets() {
    const stream = needle.get(streamURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    })

    stream.on('data', (data)=>{
        try{
            const json = JSON.parse(data)
            return json
        } catch (error){}
    })
}



const getTweets = async () => {
    const res = await axios({
        method: 'GET',
        url: streamURL,
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    }); 
    console.log(res.data.results)
    return res.data.results
};


// (async () => {
//     let currentRules
//     try {
//         // Get all stream rules
//         currentRules = await getRules()

//         // Delete all stream rules
//         await deleteRules(currentRules)

//         // Set rules based on array above
//         await setRules()
//     } catch (error) {
//         console.error(error)
//         process.exit(1)
//     }

//     streamTweets()
// })()

const getLiveTweetsFeed = async () => {
    let currentRules
    try {
        // Get all stream rules
        currentRules = await getRules()

        // Delete all stream rules
        await deleteRules(currentRules)

        // Set rules based on array above
        await setRules()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

    streamTweets()
};

module.exports = {
    getLiveTweetsFeed
};
