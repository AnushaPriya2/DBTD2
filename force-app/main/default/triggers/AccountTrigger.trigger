trigger AccountTrigger on Account(after insert) {
List<Contact> conlist = new list<Contact>();
    for(Account acc : trigger.new){
    Contact con = new Contact();
    con.LastName =acc.Name;
    con.AccountId = acc.Id;
    conlist.add(con);
}
insert conlist;
}