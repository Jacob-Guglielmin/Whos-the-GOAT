const keys = ["Adele", "Adolf Hitler", "Albert Einstein", "Barack Obama", "Beethoven", "Beyonce", "Cristiano Ronaldo", "Donald Trump", "Dream", "Ed Sheeran", "Elton John", "Elvis Presley", "Eminem", "Isaac Newton", "Jake Paul", "Johannes Gutenberg", "Justin Bieber", "Justin Trudeau", "KSI", "Kanye West", "Lebron James", "Leonardo da Vinci", "Logan Paul", "Madonna", "Mahatma Gandhi", "Michael Jackson", "Michael Jordan", "Michael Phelps", "Mozart", "MrBeast", "PewDiePie", "Rihanna", "Usain Bolt", "William Shakespeare"];

// Sorts people by elo
function sortPeople() {
    // getPerson for every person in keys
    let people = [];
    for (let i = 0; i < keys.length; i++) {
        people.push(getPerson(keys[i]));
    }

    // Sort people by elo
    people.sort((a, b) => {
        return b.Elo - a.Elo;
    })

    return people;
}

console.log(sortPeople())