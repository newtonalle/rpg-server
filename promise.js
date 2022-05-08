async function funcaoAsincrona() {
    const promises = []
    for (let i = 0; i < 5; i++) {
        promises.push(new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(i)
                resolve()
            }, i * 1000)
        }))
    }
    await Promise.all(promises)
    return 'resposta'
}

// Main

async function main() {
    try {
        const resposta = await funcaoAsincrona()
        console.log(resposta)
    } catch {
        console.log('Error')
    }
    console.log('b')
}

main()