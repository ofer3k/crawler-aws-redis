function multiplyMatrix(matrixA, matrixB)
{
    var result = new Array();//declare an array   

    //var numColsRows=$("#matrixRC").val();
    numColsRows=2;
    
    //iterating through first matrix rows
    for (var i = 0; i < numColsRows; i++) 
    {
        //iterating through second matrix columns
        for (var j = 0; j < numColsRows; j++) 
        { 
            var matrixRow = new Array();//declare an array
            var rrr = new Array();
            var resu = new Array();
            //calculating sum of pairwise products
            for (var k = 0; k < numColsRows; k++) 
            {
                rrr.push(parseInt(matrixA[i][k])*parseInt(matrixB[k][j]));
            }//for 3
            resu.push(parseInt(rrr[i])+parseInt(rrr[i+1]));

            result.push(resu);
            //result.push(matrixRow);
        }//for 2
    }//for 1
    return result;
}// function multiplyMatrix