var toto = {
    _name: "toto",
    _friends: ['titi', 'tata'],
    printFriends() {
        this._friends.forEach(  (f)  => {
            console.log(this._name + " est ami avec " + f)
        });
    }
};
toto.printFriends();