import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deleta todos os registros existentes
    await knex("patients").del();

    // Obtem os IDs dos usuários criados
    const users = await knex("users")
        .whereIn("email", ["johndoe@email.com", "janedoe@email.com"])
        .select("id", "email");

    const johnDoeUserId = users.find(u => u.email === "johndoe@email.com")?.id;
    const janeDoeUserId = users.find(u => u.email === "janedoe@email.com")?.id;

    // Insere os registros iniciais
    await knex("patients").insert([
        {
            name: "John Doe",
            cpf: "12345678901",
            birth_date: new Date("1985-05-15"),
            phone: "(11) 98765-4321",
            email: "johndoe@email.com",
            address: "123 Main St, New York, NY",
            user_id: johnDoeUserId,
            active: true
        },
        {
            name: "Jane Doe",
            cpf: "10987654321",
            birth_date: new Date("1990-10-20"),
            phone: "(11) 91234-5678",
            email: "janedoe@email.com",
            address: "456 Elm St, Los Angeles, CA",
            user_id: janeDoeUserId,
            active: true
        },
        {
            name: "Alice Johnson",
            cpf: "45678912301",
            birth_date: new Date("1975-03-25"),
            phone: "(11) 97777-8888",
            email: "alice@email.com",
            address: "789 Oak St, Chicago, IL",
            active: true
        },
        {
            name: "Bob Smith",
            cpf: "78945612301",
            birth_date: new Date("1982-12-10"),
            phone: "(11) 95555-6666",
            email: "bob@email.com",
            address: "321 Pine St, Miami, FL",
            active: true
        },
        {
            name: "Carol White",
            cpf: "32165498701",
            birth_date: new Date("1995-07-30"),
            phone: "(11) 93333-4444",
            email: "carol@email.com",
            address: "654 Maple St, Houston, TX",
            active: true
        }
    ]);
} 