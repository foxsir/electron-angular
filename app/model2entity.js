const fs = require("fs")

fs.readdir('./models', 'utf8', function (err,data) {
  data.forEach(file => {
    if(file !== 'model-map.ts') {
      convert(file);
    }
  });
})


function convert(file) {
  fs.readFile('./models/' + file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    const lines = data.split("\n");
    let newContent = "import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';\n\n";
    lines.forEach(line => {
      if(line.includes(";")) {
        if(line.includes("string")) {
          line = line.replace(";", " = \"\";");
        }
        if(line.includes("number")) {
          line = line.replace(";", " = 0;");
        }
        if(line.includes("boolean")) {
          line = line.replace(";", " = false;");
        }
        const newLine = `  @Column({nullable: true})
${line}
\n`;
        newContent += newLine;
      } else if(line.includes("class")) {
        line = line.replace("{", "extends BaseEntity {");
        newContent += `@Entity()
${line}
  @PrimaryGeneratedColumn()
  id: number;

`;
      } else {
        newContent += `
${line}
`;
      }
    });
    console.dir(newContent);
    fs.writeFile("./entitys/" + file, newContent, () => {

    });
  });

}
