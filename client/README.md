
instalirana je VS extenzija SQLite Viewer 

Company ima : id, name, description
Job: id, companyId, title, description, createdAt
User ima: id, companyId, email, password


da sqlite vrati na pocetne vrednosti koristi se komanda: node scripts/create-db.js


Token se moze raspakovati token na https://jwt.io/


/////     Ovo je query objekat za job
// query{job (id:"000000000050"){
//   id
//   title
//   description
// }}


////         Ovo je quey objekat kada se koriste varijable (ovaj qury se moze imenovati tako sto ce se staviti JobById iza query):

// query($jobId: ID!) {job(id: $jobId){
//   id
//   title
//   description
// }}

// ////         i mora se dodati varijabla: 
// {
//   "jobId": "000000000050"
// }


//////    Za CREATE JOB: 
// mutation CreateJob($input:CreateJobInput!){
//   job:createJob(input:$input){
//     id
//   }
// }

// Variables su: 
//  {
//   "input": {
//     "title": "JavaScript Developer",
//     "description":"Good job"
//   }
// }

// Header je (Header se moze raspoakoati na: https://jwt.io/): 
// Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCdkJOVzYzNlo4OUwiLCJlbWFpbCI6ImJvYkBnb29ib29rLmNvIiwiaWF0IjoxNjk3Mzc5NDI0fQ.-o_eJz6yUb7W8BwwndM6yXuQGuGZvB0SFIgKFt7jOcc

///////////////////
///////////////////
///////////////////

//  ovo je query za jobs,(preskocice se prvih deset poslova i vratice se narednih 10)

query Jobs{
    jobs(limit:10, offset:10){
       items{
            id
            date
            title
            company{
                id
                name
            }
        }
        totalCount
    }
}