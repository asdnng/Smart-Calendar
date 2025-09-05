package project_MG.MG.controller;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MainController {

    @GetMapping("hello")
    public String hello(Model model) {
        model.addAttribute("data", "spring!");
        return "hello";
    }

    @GetMapping("hello-mvc")
    public String helloMvc(@RequestParam(value = "name", required = false) String name, Model model) {
        model.addAttribute("name", name);
        return "hello-template";
    }

    @GetMapping("hello-string")
    @ResponseBody  // put the data directly into the body of the HTTP response.
    public String helloString(@RequestParam(value = "name", required = false) String name) {
        return "hello " + name; // returns the string directly, not processed by a template engine
    }

    @GetMapping("hello-api")
    @ResponseBody
    public Hello helloApi(@RequestParam("name") String name) {
        Hello hello = new Hello();
        hello.setName(name);
        return hello;
    }

//    @GetMapping("/hello")
//    @ResponseBody
//    public String test() {
//        return "Hello, world!";
//    }

    static class Hello {
        private String name; // because of private, can only access through getter,setter from external libraries

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}

