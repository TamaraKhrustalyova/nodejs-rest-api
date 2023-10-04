const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, "contacts.json");
console.log(__dirname);

const updateContactsList = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async() => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(c => c.id === contactId);
  return result || null;
}

const addContact = async ({name, email, phone}) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name, 
    email, 
    phone
  };
  contacts.push(newContact);
  await updateContactsList(contacts);
  return newContact;
}

const updateContact = async (contactId, {name, email, phone}) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(i => i.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = {id: contactId, name, email, phone};
  await updateContactsList(contacts);
  return contacts[index];
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
    const index = contacts.findIndex(c => c.id === contactId);
    if (index === -1) {
        return null;
    }
    const [result] = contacts.splice(index, 1);
    await updateContactsList(contacts);
    return result;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
