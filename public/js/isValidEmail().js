function isValidEmail()
{
    var x=document.getElementById("email").value;
    var c1=0;
    var c2=0;
    for(var i=0;i<x.length;i++)
    {
       if(x.charAt(i)=='.')
        {
            c1++;
        }
        if(x.charAt(i)=='@')
        {
            c2++;
        }
    }
   if(c1==0 || c2==0)
    {
        alert("pls enter correct email");
    }
}