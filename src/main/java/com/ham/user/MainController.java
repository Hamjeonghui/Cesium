package com.ham.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
    @RequestMapping("/")
    public String home(){
        return "user/index";
    }

    @RequestMapping("/index.do")
    public String home2(){
        return "user/index";
    }

    @RequestMapping("/windy.do")
    public String customWindy(){
        return "user/windyCustom";
    }
}
