class Utils {
    public static checkCPF(cpf: string) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        var result = true;
        [9, 10].forEach(function (j) {
            var sum = 0, r;
            cpf.split(/(?=)/).splice(0, j).forEach(function (e, i) {
                sum += parseInt(e) * ((j + 2) - (i + 1));
            });
            r = sum % 11;
            r = (r < 2) ? 0 : 11 - r;
            if (r != parseInt(cpf.substring(j, j + 1))) result = false;
        });
        return result;
    }

    public static removeMask(value: string): string {
        return value.replace(/\D/g, '');
    }

    public static formatPhone(phone: string | undefined | null): string {
        if (!phone) return '';
        const numericOnly = this.removeMask(phone);
        return numericOnly.trim().substring(0, 15);
    }
}

export default Utils;