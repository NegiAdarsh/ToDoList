// making our own module for date
// console.log(module);
module.exports.getDate=getDate;
// or we can use just exports like in below 

function getDate()
{
    var today=new Date();

    var options ={
            weekday: "long",
            day: "numeric",
            month: "long",
            year:"numeric"
        };
    var day=today.toLocaleDateString("en-US",options);
    // day=today.toLocaleDateString("hi-IN",options);
    // or return today.toLocaleDateString("en-US",options);
    return day;
}

// javascript module are objects having properties and methods
exports.getDay= function ()
{
    var today=new Date();

    var options ={
            weekday: "long",
        };
    var day=today.toLocaleDateString("en-US",options);
    // day=today.toLocaleDateString("hi-IN",options);
    // or return today.toLocaleDateString("en-US",options);
    return day;
}
console.log(module.exports);
