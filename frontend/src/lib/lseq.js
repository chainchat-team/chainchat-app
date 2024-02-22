class Lseq {
    constructor() {
        this.struct = [['h', 'i']]
        const chars = this.struct[0].splice(0, 2)
        console.log(this.struct)
        console.log(chars)
    }

}

const c = new Lseq()